import {html} from '../../src/index-externals.js';
import {SWCElement} from "../SWCElement.js";
import {ApiFetched, SourceSelected} from "../../src/events.js";

import "./supabase-login-email.js";
import "./supabase-connection.js";
import {NamedJSONComparer} from "../../src/main.js";
import {showToastMessage, toastTypes} from "../../src/toast.js";
import {getSchemaFriendlyName} from "../../src/openapi-utils.js";


export class SupabaseIndex extends SWCElement {
    static properties = {
        client: {state: true, hasChanged: NamedJSONComparer('SupabaseIndex.client')},
        sources: {state: true, hasChanged: NamedJSONComparer('SupabaseIndex.sources')},
        source: {state: true, hasChanged: NamedJSONComparer('SupabaseIndex.source')},
        api: {state: true, hasChanged: NamedJSONComparer('SupabaseIndex.api')},
    };

    constructor() {
        super();
        this.sources = []
        this.client = null
        // this.source = this.sources[0]
    }

    _selectSource(source) {
        // this.source = source
        const detail = {
            source,
            api: this.api,
            // client: this.client,
            // message: 'Something important happened'
        }
        this.dispatch(SourceSelected, detail);
    }

    render() {
        // if(!this.sources) return null

        return html`
<!--            client: ${this.client}-->
            <ul>
                ${this.sources.map(source => html`
                    <li>
                        <a href="#${source[0]}" @click="${() => this._selectSource(source)}">
                            ${getSchemaFriendlyName(this.api, source[0])}
                        </a>
                            <!--(${Object.keys(source[1]).join(",")})-->
                    </li>`)}
            </ul>
        `
    }


    set client(client) {
        // We need this, for some reason, otherwise we get infinite loops or multiple fetches
        if (client === this._client)
            return
        this._client = client
        if (!this._client)
            return

        showToastMessage(toastTypes.startOperation, 'Fetching API')
        this._client.from("").select().then(({data, error}) => {
            if (error) {
                console.error(error)
                showToastMessage(toastTypes.error, 'Fetching API failed', error.message)
            } else {
                showToastMessage(toastTypes.success, 'API fetched')
                this.dispatch(ApiFetched, {api: data})
                // console.log({paths: Object.entries(data.paths)})
                this.api = data
                // Object.getOwnPropertyDescriptors(data.paths)
                const sources = Object.entries(data.paths)
                    .filter(s => s[0] !== '/')
                // .slice(0, 5)
                // .map(s => s.substring(1))
                // console.log({sources})
                this.sources = sources
                this._selectSource(sources[0])
            }
        })
    }
}

customElements.define('supabase-index', SupabaseIndex);
