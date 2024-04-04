import {html} from './index-supabase.js';
import {SWCElement} from "./SWCElement.js";
import './index.js'
import {NamedJSONComparer} from "./main.js";


export class SupabaseSite extends SWCElement {
    static properties = {
        sections: {state: true},
        client: {state: true},
        api: {state: true},
        user: {state: true},
        source: {state: true, hasChanged: NamedJSONComparer('SupabaseSite.source')},
        item: {state: true, hasChanged: NamedJSONComparer('SupabaseSite.item')},
    }

    render() {
        return html`
            <h1>Supabase </h1>

            <details ?open="${!this.client}">
                <summary>${this.client ? 'Connected!' : 'Connect'}</summary>
                <div>
                    <supabase-connection
                            @client-created="${e => {
                                console.log('client-created', e.detail.client)
                                return this.client = e.detail.client;
                            }}"
                    ></supabase-connection>
                </div>
            </details>

            <details ?open="${this.client && !this.user}">
                <summary>${this.user ? `Logged in as ${this.user.email}` : 'Log in'}</summary>
                <div>
                    <supabase-login-email
                            .client="${this.client}"
                            @user-logged-in="${e => this.user = e.detail.user}"
                    ></supabase-login-email>
                </div>
            </details>

            <details ?open="${this.client}">
                <summary>Index</summary>
                <div>
                    <supabase-index
                            .client="${this.client}"
                            @supabase-source-selected="${e => this.source = e.detail.source}"
                            @api-fetched="${e => {
                                console.log('api-fetched', e.detail.api)
                                return this.api = e.detail.api;
                            }}"
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
                            .client="${this.client}"
                            .item="${this.item}"
                    ></supabase-item>
                </div>
            </details>
        `


    }
}

customElements.define('supabase-site', SupabaseSite);
