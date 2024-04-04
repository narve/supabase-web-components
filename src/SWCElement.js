import {LitElement} from './index-externals.js';

export class SWCElement extends LitElement {
    createRenderRoot() {
        // console.log(`SWCElement::${this.constructor.name} createRenderRoot`, {shadow: this.shadow})
        return (this.shadow || this.shadow === "")
            ? super.createRenderRoot()
            : this;
    }

    dispatch(eventType, detail) {
        console.log(`SWCElement::${this.constructor.name} dispatch`, eventType, detail)
        this.dispatchEvent(new CustomEvent(eventType, {detail}))
    }
}