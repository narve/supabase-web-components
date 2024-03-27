import {LitElement, css, html} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import {__swc as swc} from './main.js'
import {SWCElement} from "./SWCElement.js";
import {NewItem} from "./events";


// const sources = ['item', 'countries']

export class SupabaseItem extends SWCElement {

    constructor() {
        super();

    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener(NewItem,
            e => this._handleNewItem(e));
    }

    disconnectedCallback() {
        window.removeEventListener(NewItem,
            e => this._handleNewItem(e));
        super.disconnectedCallback();
    }

    _handleNewItem(evt) {

    }

    render() {
        return html`item editor: ${this.item}`
    }
}

customElements.define('supabase-item', SupabaseItem);
