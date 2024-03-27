import {LitElement, css, html, styleMap} from 'https://cdn.jsdelivr.net/gh/lit/dist@3.1.2/all/lit-all.min.js';
import {__swc as swc} from './main.js'
import {SWCElement} from "./SWCElement.js";
import {showToastMessage, toastTypes} from "./toast.js";
import {SourceSelected} from "./events.js";

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
        this.order = {
            column: 'id',
            ascending: true
        }
        this.shadow = false
        this.hitsPrPage = 5
        this.range = [0, this.hitsPrPage - 1]
        this.buttonStyles = {
            float: 'right',
        }
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener(SourceSelected,
            e => this._handleSourceSelected(e));
    }

    disconnectedCallback() {
        window.removeEventListener(SourceSelected,
            e => this._handleSourceSelected(e));
        super.disconnectedCallback();
    }

    async _handleSourceSelected(event) {
        this.source = event.detail.source
        // const args = new Map(Object.entries(event.detail))
        // console.log('source-selected: ', args)
        // await this.updated(args)
        // await this._fetch()
    }


    async updated(changedProperties) {
        if (changedProperties.has('source') || changedProperties.has('range')) {
            await this._fetch();
        }
    }


    _fetch = async () => {
        if (!this.source)
            return

        const response = await swc.client
            .from(this.source)
            .select('*', {count: 'exact'})
            .range(this.range[0], this.range[1])
            .order(this.order.column, {ascending: this.order.ascending})

        const {data, error, count} = response

        if (error) {
            showToastMessage(toastTypes.error, "Error", error.message, 3000)

        } else {
            // This should trigger an re-render:
            this.data = data
            this.count = count

            const msg = `${this.source} (${this.data.length} of ${count} items)`
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
                    <tr> ${Object.keys(this.data[0]).map((h) => this._headerCell(h))}</tr>`
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
            <tr>${Object.values(row).map(this._cell)}</tr>`
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

    async _prev() {
        this.range = [this.range[0] - this.hitsPrPage, this.range[1] - this.hitsPrPage]
        await this._fetch()
    }

    async _next() {
        this.range = [this.range[0] + this.hitsPrPage, this.range[1] + this.hitsPrPage]
        await this._fetch()
    }

    _paginationRow() {
        if(!this.data)
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

    }

    render() {
        return html`
            <div class="supabase-table" part="container">
                <table>
                    <thead>
                    <tr>
                        <th colspan="99">
                            Table: ${this.source}
                            <div style=${styleMap(this.buttonStyles)} class="reload">
                                <button style=${styleMap(this.buttonStyles)} class="reload" @click="${() => this._newItem()}">
                                    &plus;
                                </button>
                                <button style=${styleMap(this.buttonStyles)} class="reload" @click="${() => this._fetch()}">
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
