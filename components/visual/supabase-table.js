import {html, styleMap} from '../../src/index-externals.js';
import {SWCElement} from "../SWCElement.js";
import {showToastMessage, toastTypes} from "../../src/index.js";
import {NewItem, EditItem, RequestSelector} from "../../src/events.js";
import {getFatSelect} from "../../src/supabase-utils.js";

export class SupabaseTable extends SWCElement {
    static properties = {
        source: {},
        title: {},

        hitsPrPage: {},
        sourceDisplay: {},
        client: {state: true},

        select: {state:true},

        // Internal:
        order: {state: true},
        api: {state: true},
        data: {state: true},
        count: {state: true},
        range: {state: true},
        selectors: {state: true},
    };

    constructor() {
        super();
        this.order = null
        this.select = "*"
        this.shadow = false
        this.hitsPrPage = 5
        this.range = [0, this.hitsPrPage - 1]
        this.buttonStyles = {
            float: 'right',
        }
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener(RequestSelector, e => this._handleSelectorRequested(e));
    }

    async updated(changedProperties) {
        if (changedProperties.has('source') || changedProperties.has('range')) {
            if(this.source) {
                this.select = getFatSelect(this.api, this.source[0])
                await this._fetch();
            }
        }
    }

    _fetch = async () => {
        if (!this.source)
            return

        const sourceUrl = this.source[0].substring(1)
        // const sourceUrl = this.select

        let query = this.client
            .from(sourceUrl)
            .select()
            .range(this.range[0], this.range[1])
        if(this.order) {
            console.log('using order: ', this.order)
            query = query.order(this.order.column, this.order)
        }
        const response = await query;
        // const response = await this.client
        //     .from(sourceUrl)
        //     .select(this.select, {count: 'exact'})
        //     .order(this.order?.column || "")
        // const response =
        // this.order
        // ? await responsePreOrder
        //     .order(this.order?.column || null, {ascending: this.order?.ascending || true})
        // :
        //     await responsePreOrder

        const {data, error, count} = response

        if (error) {
            showToastMessage(toastTypes.error, "Error", error.message, 3000)

        } else {
            // This should trigger an re-render:
            this.data = data
            this.count = count

            const msg = `${this.source[0]} (${this.data.length} of ${count} items)`
            showToastMessage(toastTypes.info, 'Fetched', msg)
        }
    }

    _rows() {
        if (!this.source)
            return this._noRows('No source selected')
        else if (!this.data)
            return this._noRows('No data')
        else if (!this.data[0])
            return this._noRows('No rows')
        return this.data.map(row => this._row(row))
    }

    _headers() {
        return (this.data && this.data[0])
            ? html`
                    <tr>
                        <th>Actions</th>
                        ${Object.keys(this.data[0]).map((h) => this._headerCell(h))}
                    </tr>`
            : html``
    }

    _setOrder(order) {
        console.log('setOrder: ', order)
        this.order = order
        this._fetch().finally(() => console.log('fetched: ', this.source))
    }

    _headerCell(column) {
        return html`
            <th>${column}
                <button style=${styleMap(this.buttonStyles)} @click="${() => this._setOrder({column})}">&uArr;</button>
                <button style=${styleMap(this.buttonStyles)} @click="${() => this._setOrder({column, ascending:false})}">&dArr;</button>
            </th>`
    }

    _row(row) {
        // return html` <em>ROWS</em>`
        return html`
            <tr>
                <th>
                    ${this.source[1].put || this.source[1].patch
                            ? html`
                                <button @click="${() => this._edit(row)}">&#9998;</button>`
                            : null
                    }
                    ${this.source[1].delete
                            ? html`
                                <button @click="${() => this._delete(row)}">&#x1F5D1;</button>`
                            : null
                    }
                </th>
                ${Object.values(row).map((c,i) => this._cell(c,i))}
            </tr>`
    }

    _cell(cell, index) {

        if(cell instanceof Object) {
            return html`
                <td>
<!--                    <pre>${JSON.stringify(cell, null, 2)}</pre>-->
<!--                    <span>${cell.name} (#${cell.id})</span>-->
                    <span>${Object.entries(cell).map(sa=>sa[1])[1]} (#${cell.id})</span>
                </td>`
        } else if(cell instanceof Date) {
            return html`
            <td><time datetime="${cell}">${cell}</time> </td>
            `
        }
        return html`
            <td>${cell}</td>`
    }

    _noRows(msg) {
        return html`
            <tr>
                <td colspan="99">${msg}</td>
            </tr>`
    }

    async _edit(row) {
        const detail = {
            item: row,
            source: this.source,
            api: this.api,
            client: this.client,
            message: 'Edit item'
        }
        this.dispatch(NewItem, detail);
    }

    async _delete(row) {
        const {id} = row
        const response = await this.client
            .from(this.source[0].substring(1))
            .delete()
            .eq('id', id)
        const {error} = response
        if (error) {
            showToastMessage(toastTypes.error, "Error", error.message, 3000)
        } else {
            showToastMessage(toastTypes.success, "Deleted", `Item ${id} deleted`, 3000)
            await this._fetch()
        }
    }

    async _prev() {
        this.range = [this.range[0] - this.hitsPrPage, this.range[1] - this.hitsPrPage]
        await this._fetch()
    }

    async _next() {
        this.range = [this.range[0] + this.hitsPrPage, this.range[1] + this.hitsPrPage]
        await this._fetch()
    }

    _paginationRow() {
        if (!this.data)
            return ""
        return html`
            <td colspan="99">
                ${Math.min(this.count, this.range[0] + 1)}-${Math.min(this.range[1] + 1, this.count)} of ${this.count}
                rows
                <span style=${styleMap(this.buttonStyles)}>
                    <button @click="${() => this._prev()}">&lt;</button>
                    <button @click="${() => this._next()}">&gt;</button>
                </span>
            </td>`
    }

    _newItem() {
        const detail = {
            item: {},
            source: this.source,
            api: this.api,
            client: this.client,
            message: 'New item'
        }
        this.dispatch(NewItem, detail);
    }

    get sourceName() {
        return this.source[0].substring(1).charAt(0).toUpperCase()
            + this.source[0].substring(2).replace("_", " ")

    }

    render() {

        if (!this.source) return null

        if (this.data && !Array.isArray(this.data)) {
            return html`
                <h3>Non-table data: </h3>
                <pre>${this.data}</pre>
            `
        }
        return html`
            <div class="supabase-table" part="container">
                <table>
                    <thead>
                    <tr>
                        <th colspan="99">
                            Table: ${this.sourceName}
                            <div style=${styleMap(this.buttonStyles)} class="reload">
                                ${this.source[1].post
                                        ? html`
                                            <button style=${styleMap(this.buttonStyles)} class="reload"
                                                    @click="${() => this._newItem()}">
                                                &plus;
                                            </button>`
                                        : null}
                                <button style=${styleMap(this.buttonStyles)} class="reload"
                                        @click="${() => this._fetch()}">
                                    &#x21BB;
                                </button>
                            </div>
                        </th>
                    </tr>
                    <tr>
                        <th colspan="99">
                            <input value="${this.select}" >
                        </th>
                    </tr>
                    ${this._headers()}
                    </thead>
                    <tbody>
                    ${this._rows()}
                    </tbody>
                    <tfoot>
                    <tr>
                        ${this._paginationRow()}
                    </tr>
                    </tfoot>
                </table>
            </div>
        `
    }

    async _handleSelectorRequested(event) {
        console.log('selector requested: ', event.detail)

        const {table, column, client} = event.detail
        const ref = `${table}__${column}`

        const found = document.getElementById(ref)
        if(found) {
            console.log('Selector already exists: ', ref)
            return
        }

        showToastMessage(toastTypes.startOperation, "Fetching selector", `${table}`)

        const {data, error, count} = await client
            .from(table)
            .select('*', {count: 'exact'})

        if (error) {
            showToastMessage(toastTypes.error, "Error", error.message, 3000)
            return
        }

        showToastMessage(toastTypes.info, `Fetched selector ${ref}`, count + ' items fetched')

        const e = document.createElement('div')
        e.innerHTML = `
            <datalist id="${ref}">
            ${data.map(row => `
                <option value='${row[column]}'>
                ${Object.values(row).join(', ')}
                </option>`)
            .join('')}
            </datalist>
        `
        document.body.appendChild(e)
    }
}

customElements.define('supabase-table', SupabaseTable);
