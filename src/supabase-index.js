import {LitElement, css, html} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import {client} from './main.js'
import {SupabaseTable} from "./supabase-table.js";
import {SWCElement} from "./SWCElement.js";


// const sources = ['item', 'countries']

export class SupabaseIndex extends SWCElement {
    static properties = {
        sources: {},
        source: {},
    };

    constructor() {
        super();
        this.sources = ['item', 'countries']
        this.source = this.sources[0]
    }

    render() {
        return html`
            <h1>Supabase</h1>
            <ul>
                ${this.sources.map(source => html`
                    <li>
                        <a href="#${source}" @click="${() => this.source = source}">
                            ${source}
                        </a></li>`)}
            </ul>

            ${this.source ?
                    html`
                        <supabase-table enableShadowDom source="${this.source}"></supabase-table>`
                    : html`<p>Select a source</p>`
            }
        `
    }

    connectedCallback() {
        super.connectedCallback()
        client.from("").select().then(({data, error}) => {
            if (error) {
                console.error(error)
            } else {
                console.log({paths: data.paths})
                const sources = Object.getOwnPropertyNames(data.paths)
                    .filter(s => s !== '/')
                    .slice(0, 10)
                    .map(s => s.substring(1))
                console.log({sources})
                this.sources = sources
            }
        })
    }
}

customElements.define('supabase-index', SupabaseIndex);
