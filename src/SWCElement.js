import {LitElement, css, html, styleMap} from 'https://cdn.jsdelivr.net/gh/lit/dist@3.1.2/all/lit-all.min.js';
import {client} from './main.js'

export class SWCElement extends LitElement {
    createRenderRoot() {
        // return super.createRenderRoot()
        console.log(`SWCElement::${this.constructor.name} createRenderRoot`, {shadow: this.shadow})

        return (this.shadow || this.shadow === "")
            ? super.createRenderRoot()
            : this;
    }
    connectedCallback() {
        super.connectedCallback()
        console.log(`SWCElement::${this.constructor.name}  connectedCallback`, {source: this.source, shadow: this.shadow})
    }
}