import {html} from '../../src/index-externals.js';
import {SWCElement} from "../SWCElement.js";
import {RequestSelector} from "../../src/events.js";
import {showToastMessage, toastTypes} from "../../src/toast.js";
import {NamedJSONComparer} from "../../src/main.js";
import {getSchema} from "../../src/openapi-utils.js";

export class SupabaseItem extends SWCElement {
    static properties = {
        item: {state: true, hasChanged: NamedJSONComparer('SupabaseItem.item')},
        source: {state: true, hasChanged: NamedJSONComparer('SupabaseItem.source')},
        api: {state: true},
        meta: {state: true},
        schema: {state: true},
    }

    constructor() {
        super();
        this.item = null
    }

    // get item(){
    //     return this._item
    // }

    async updated(changedProperties) {
        if (changedProperties.has('source')) {

            // Re-calculate which schema to use
            const getRef = s => {
                const ref = s.substring(2).split('/')
                console.log('refs: ', s, ref)
                const o1 = this.api[ref[0]]
                return o1[ref[1]]
            }

            const p0Ref = this.api.paths[this.source[0]]['post']['parameters'][0]['$ref']
            // console.log({p0})
            // const p0ref = p0.substring("#/parameters/".length)
            const pDef = getRef(p0Ref)
            console.log({pDef})

            const schema = getRef(pDef.schema['$ref'])
            console.log({sRef: schema})
            this.schema = schema

            this.schema = getSchema(this.api, this.source[0], 'get')
        }
    }

    _field(name, value) {
        const hasDesc = !!value.description
        const isPk = value.description?.indexOf("<pk/>") >= 0
        const isFk = value.description?.indexOf(".<fk") >= 0
        // const label = name + (hasDesc ? ": " + value.description : "")

        if (isFk) {
            const parts = /.*<fk table='(.*)' column='(.*)'\/>.*/.exec(value.description);
            const table = parts[1]
            const column = parts[2]
            console.log({table, column})
            console.log(`SWCElement::${this.constructor.name} dispatch`, RequestSelector, {
                table,
                column,
                client: this.client
            })

            // TODO: Is there a better way?
            window.dispatchEvent(new CustomEvent(RequestSelector, {detail: {table, column, client: this.client}}))
            return html`
                <label for="${name}">${name} </label>
                <input id="${name}" name="${name}" value="${this.item[name]}" list="${table}__${column}"
                       @input="${e => this._setProp(e, name)}"
                >
            `
        }

        const noteIndex = value.description?.indexOf("Note:\n")
        let label = name
        if (noteIndex >= 0) {
            label = value.description.substring(0, noteIndex).trim()
            // label = value.description
            if (label.length === 0) label = name
        } else if (hasDesc) {
            label = value.description
        }

        console.log({hasDesc, noteIndex, label})

        if (isPk) {
            return html`
                <label for="${name}">${label} </label>
                <input type="text" id="${name}" name="${name}" value="${this.item[name]}" readonly disabled>
            `
        }

        return html`
            <label for="${name}">${label} </label>
            <input type="text" id="${name}" name="${name}" value="${this.item[name]}"
                   @input="${e => this._setProp(e, name)}"
            >
        `

    }


    _form() {
        if (!this.schema) {
            return html`<p>No schema</p>`
        }
        const fields = Object.entries(this.schema.properties)
        return html`
            <form>
                ${fields.map(([name, value]) => this._field(name, value))}
                <input type="submit" value="Submit" @click="${this._save}">
            </form>
        `
    }

    async _save(event) {
        event.preventDefault()
        console.log('SAVE: ', event, this.item)

        const item = {}

        for (const [n, v] of Object.entries(this.item)) {
            if (v instanceof Object)
                item[n] = v.id
            else
                item[n] = v
        }

        const {data, error} = await this.client.from(this.source[0].substring(1))
            .upsert([item])
            .select()
        console.log({data, error})
        if (error) {
            showToastMessage(toastTypes.error, 'Could not save item', error.message, 5000)
        } else {
            showToastMessage(toastTypes.success, 'Item saved', ' ')
        }
    }

    _setProp(e, name) {
        this.item[name] = e.target.value
        console.log('SET PROP: ', name, e.target.value)
        e.preventDefault()
        this.requestUpdate();
    }

    render() {
        return html`

            ${this.item ? this._form() : html`<p>No item</p>`}

            <div class="debugging">
                <h3>Item</h3>
                <pre>${JSON.stringify(this.item, null, '  ')}</pre>

                <h3>Schema</h3>
                <pre>${JSON.stringify(this.schema, null, '  ')}</pre>

                <h3>API</h3>
                <pre>${JSON.stringify(this.api, null, '  ')}</pre>
            </div>
        `
    }
}

customElements.define('supabase-item', SupabaseItem);
