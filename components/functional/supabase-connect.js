import {showToastMessage, toastTypes} from "../../src/index.js";
import {createClient} from "../../src/index-externals.js";
import {ClientCreated} from "../../src/events.js";

export class SupabaseConnect extends HTMLElement {
    // static observedAttributes = ["size", "siteTitle"];

    constructor() {
        super()
        // console.log('Constructing ' + this.constructor.name)
    }

    connectedCallback() {
        // console.log('connectedCallback', this.attributes)
        const title = this.getAttribute("title")
        const url = this.getAttribute("url")
        const key = this.getAttribute("key")
        setTimeout(() => {
            showToastMessage(toastTypes.startOperation, 'Connecting to ' + title)
            const client = createClient(url, key)
            showToastMessage(toastTypes.success, 'Connected to ' + title)
            this.dispatchEvent(new CustomEvent(ClientCreated, {detail: {client}, bubbles: true}))
        }, 1)
    }

}

customElements.define('supabase-connect', SupabaseConnect);
