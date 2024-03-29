import {LitElement, css, html} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import {__swc as swc} from './main.js'
import {SWCElement} from "./SWCElement.js";
import {EditItem, NewItem} from "./events.js";
import {showToastMessage, toastTypes} from "./toast.js";


// const sources = ['item', 'countries']

export class SupabaseItem extends SWCElement {
    static properties = {
        item: {
            state: true, hasChanged: (e1, e2) => JSON.stringify(e1) !== JSON.stringify(e2)
        }, source: {state: true}, api: {state: true}, meta: {state: true}
    }

    constructor() {
        super();

    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener(NewItem, e => this._handleNewItem(e));
        window.addEventListener(EditItem, e => this._handleNewItem(e));
    }

    disconnectedCallback() {
        window.removeEventListener(NewItem, e => this._handleNewItem(e));
        super.disconnectedCallback();
    }

    _handleNewItem(evt) {
        console.log('NEW ITEM: ', evt.detail)
        this.item = evt.detail.item
        this.source = evt.detail.source
        this.api = evt.detail.api

        const getRef = s => {
            const ref = s.substring(2).split('/')
            console.log('refs: ', s, ref)
            const o1 = this.api[ref[0]]
            const o2 = o1[ref[1]]
            return o2
        }

        const p0Ref = this.api.paths['/' + this.source]['post']['parameters'][0]['$ref']
        // console.log({p0})
        // const p0ref = p0.substring("#/parameters/".length)
        const pDef = getRef(p0Ref)
        console.log({pDef})

        const schema = getRef(pDef.schema['$ref'])
        console.log({sRef: schema})
        this.schema = schema

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
        } else if (isFk) {

        }

        return html`
            <label for="${name}">${label} </label>
            <input type="text" id="${name}" name="${name}" value="${this.item[name]}"
                   @change="${e => this._setProp(e, name)}"
            >
        `
    }

    _form() {
        if (!this.schema) {
            return html`<p>No schema</p>`
        }
        // this.item = {
        // id: 123
        // }
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


        const {data, error} = await swc.client.from(this.source)
            .upsert([this.item])
            .select()
        console.log({data, error})
        if (error) {
            showToastMessage(toastTypes.error, 'Could not UPSERT', error.message, 5000)
        } else {
            showToastMessage(toastTypes.success, 'UPSERTED', ' ')
        }
    }

    // } else {
    //     await swc.client.from(this.source).insert([this.item]).then(({data, error}) => {
    //         if (error) {
    //             console.error(error)
    //         } else {
    //             console.log('INSERTED: ', data)
    //         }
    //     })
// }

// }

    _setProp(e, name) {
        this.item[name] = e.target.value
        console.log('SET PROP: ', name, e.target.value)
        e.preventDefault()
        // this.item = {...this.item}
        // this.updated(new Map(Object.entries(this.item))) //['item', this.item]))
        // console.log('SET PROP 2: ', this.item)
        this.requestUpdate();
    }

    render() {
        return html`ITEM: ${JSON.stringify(this.item)}

        ${this._form()}


<!--        <pre>${JSON.stringify(this.schema, null, '  ')}</pre>-->

        `
    }
}

customElements.define('supabase-item', SupabaseItem);
