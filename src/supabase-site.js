import {html} from './index-externals.js';
import {SWCElement} from "./SWCElement.js";
import './index.js'
import {NamedJSONComparer} from "./main.js";
import {showToastMessage, toastTypes} from "./toast.js";


export class SupabaseSite extends SWCElement {
    static properties = {
        sections: {state: true},
        client: {state: true},
        api: {state: true},
        user: {state: true},
        source: {state: true, hasChanged: NamedJSONComparer('SupabaseSite.source')},
        item: {state: true, hasChanged: NamedJSONComparer('SupabaseSite.item')},
    }

    constructor() {
        super()
    }

    render() {
        return html`
            <h1>Supabase </h1>

            <details ?open="${!this.client}">
                <summary>${this.client ? 'Connected!' : 'Connect'}</summary>
                <div>
                    <supabase-connection
                            @client-created="${e => this.client = e.detail.client}"
                    ></supabase-connection>
                </div>
            </details>

            <details ?open="${this.client && !this.user}">
                <summary>${this.user ? `Logged in as ${this.user.email}` : 'Log in'}</summary>
                <div>
                    <html-include no-shadow src="../html/login-email.html"></html-include>


                    ${true ? '' : html`
                    <supabase-login-email
                            my-atrriubte="cool"
                            .client="${this.client}"
                            @user-logged-in="${e => this.user = e.detail.user}"
                    ></supabase-login-email>
                    `}
                </div>
            </details>

            <details ?open="${this.client}">
                <summary>Index</summary>
                <div>
                    <supabase-index
                            .client="${this.client}"
                            @supabase-source-selected="${e => this.source = e.detail.source}"
                            @api-fetched="${e => this.api = e.detail.api}"
                    ></supabase-index>
                </div>
            </details>

            <details ?open="${this.client && this.source}">
                <summary>Data</summary>
                <div>
                    <supabase-table
                            .client="${this.client}" .source="${this.source}" .api="${this.api}"
                            @supabase-new-item="${e => this.item = e.detail.item}"
                    ></supabase-table>
                </div>
            </details>

            <details ?open="${this.item}">
                <summary>Item</summary>
                <div>
                    <supabase-item
                            .api="${this.api}"
                            .source="${this.source}"
                            .client="${this.client}"
                            .item="${this.item}"
                    ></supabase-item>
                </div>
            </details>
        `
    }
}

customElements.define('supabase-site', SupabaseSite);
