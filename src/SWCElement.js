import {LitElement} from './index-externals.js';

export class SWCElement extends LitElement {
    createRenderRoot() {
        // console.log(`SWCElement::${this.constructor.name} createRenderRoot`, {shadow: this.shadow})
        return (this.shadow || this.shadow === "")
            ? super.createRenderRoot()
            : this;
    }
}