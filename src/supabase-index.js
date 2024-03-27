import {LitElement, css, html} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import {__swc as swc} from './main.js'
import {SupabaseTable} from "./supabase-table.js";
import {SWCElement} from "./SWCElement.js";


// const sources = ['item', 'countries']

export class SupabaseIndex extends SWCElement {
    static properties = {
        sources: {},
        source: {},

        api: {state: true},
    };

    constructor() {
        super();
        this.sources = ['item', 'countries']
        this.source = this.sources[0]
    }

    _selectSource(source) {
        // this.source = source

        let event = new CustomEvent('supabase-source-selected', {

            detail: {
                source,
                message: 'Something important happened'

            }

        });

        window.dispatchEvent(event);
        // console.log('dispatched: ', event)
    }

    render() {
        return html`
            <ul>
                ${this.sources.map(source => html`
                    <li>
                        <a href="#${source}" @click="${() => this._selectSource(source)}">
                            ${source}
                        </a></li>`)}
            </ul>
        `
        // ${this.source ?
        //         html`
        //             <supabase-table enableShadowDom xxxsource="${this.source}"></supabase-table>`
        //         : html`<p>Select a source</p>`
        // }
    }

    connectedCallback() {
        super.connectedCallback()
        swc.client.from("").select().then(({data, error}) => {
            if (error) {
                console.error(error)
            } else {
                swc.api = data
                console.log({paths: data.paths})
                const sources = Object.getOwnPropertyNames(data.paths)
                    .filter(s => s !== '/')
                    // .slice(0, 5)
                    .map(s => s.substring(1))
                console.log({sources})
                this.sources = sources
            }
        })
    }
}

customElements.define('supabase-index', SupabaseIndex);
