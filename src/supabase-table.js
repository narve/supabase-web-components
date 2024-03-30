import {html, styleMap} from './index-supabase.js';
import {SWCElement} from "./SWCElement.js";
import {showToastMessage, toastTypes} from "./toast.js";
import {SourceSelected, NewItem, EditItem} from "./events.js";

export class SupabaseTable extends SWCElement {
    static properties = {
        // Mandatory:
        source: {},
        // Optional:
        title: {},
        // The default disables shadow-dom, enabling global CSS to affect components
        shadow: {},
        hitsPrPage: {},
        sourceDisplay: {},

        // Internal:
        order: {state: true},
        data: {state: true},
        count: {state: true},
        range: {state: true},
    };

    constructor() {
        super();
        // console.log('SupabaseTable constructor', {source: this.source, shadow: this.shadow})
        // Declare reactive properties
        // this.order = {
        //     column: 'id',
        //     // ascending: true
        // }
        this.order = null
        this.shadow = false
        this.hitsPrPage = 5
        this.range = [0, this.hitsPrPage - 1]
        this.buttonStyles = {
            float: 'right',
        }
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener(SourceSelected, e => this._handleSourceSelected(e));
    }

    disconnectedCallback() {
        window.removeEventListener(SourceSelected,
            e => this._handleSourceSelected(e));
        super.disconnectedCallback();
    }

    async _handleSourceSelected(event) {
        this.source = event.detail.source
        this.order = null
        this.api = event.detail.api
        this.client = event.detail.client
        // const args = new Map(Object.entries(event.detail))
        console.log('source-selected: ', event.detail)
        // await this.updated(args)
        // await this._fetch()

        // this._newItem()
    }


    async updated(changedProperties) {
        if (changedProperties.has('source') || changedProperties.has('range')) {
            await this._fetch();
        }
    }


    _fetch = async () => {
        if (!this.source)
            return

        const sourceUrl = this.source[0].substring(1)

        const response = await this.client
            .from(sourceUrl)
            .select('*', {count: 'exact'})
            .range(this.range[0], this.range[1])
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
        this.order = {
            column: order,
            ascending: !this.order.ascending
        }
        this._fetch().finally(() => console.log('fetched: ', this.source))
    }

    _headerCell(header) {
        return html`
            <th>${header}
                <button style=${styleMap(this.buttonStyles)} @click="${() => this._setOrder(header)}">&uArr;</button>
                <button style=${styleMap(this.buttonStyles)} @click="${() => this._setOrder(header)}">&dArr;</button>
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
                ${Object.values(row).map(this._cell)}
            </tr>`
    }

    _cell(cell) {
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
        window.dispatchEvent(new CustomEvent(EditItem, {detail}));
    }

    async _delete(row) {
        const {id} = row
        const response = await swc.client
            .from(this.source)
            .delete()
            .eq('id', id)
        const {error} = response
        if (error) {
            showToastMessage(toastTypes.error, "Error", error.message, 3000)
        } else {
            showToastMessage(toastTypes.info, "Deleted", `Item ${id} deleted`, 3000)
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
        window.dispatchEvent(new CustomEvent(NewItem, {detail}));
    }

    get sourceName() {
        return this.source[0].substring(1).charAt(0).toUpperCase()
            + this.source[0].substring(2).replace("_", " ")

    }

    render() {
        if (!this.source) return null

        if(!Array.isArray(this.data)) {
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
            </div>`
    }
}

customElements.define('supabase-table', SupabaseTable);
