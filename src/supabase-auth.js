import {LitElement, css, html} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import {__swc as swc} from './main.js'
import {SWCElement} from "./SWCElement.js";


export class SupabaseAuth extends SWCElement {

    render() {
        return html`
            <details>
                <summary>Auth</summary>
                <div>
                contents here
                </div>
            </details>
        `
    }
}

customElements.define('supabase-auth', SupabaseAuth);
