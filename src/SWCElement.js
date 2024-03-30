import {LitElement, css, html, styleMap} from './index-supabase.js';

export class SWCElement extends LitElement {
    createRenderRoot() {
        // console.log(`SWCElement::${this.constructor.name} createRenderRoot`, {shadow: this.shadow})

        return (this.shadow || this.shadow === "")
            ? super.createRenderRoot()
            : this;
    }
    connectedCallback() {
        super.connectedCallback()
        // console.log(`SWCElement::${this.constructor.name}  connectedCallback`, { shadow: this.shadow})
    }
}