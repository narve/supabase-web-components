import {html} from './index-supabase.js';
import {SWCElement} from "./SWCElement.js";
import {ClientCreated, SourceSelected} from "./events.js";

export class SupabaseIndex extends SWCElement {
    static properties = {
        sources: {},
        source: {},
        api: {state: true},
    };

    constructor() {
        super();
        // this.sources = ['item', 'countries']
        // this.source = this.sources[0]
    }

    _selectSource(source) {
        // this.source = source
        const detail = {
            source,
            api: this.api,
            client: this.client,
            message: 'Something important happened'
        }
        window.dispatchEvent(new CustomEvent(SourceSelected, {detail}));
    }

    render() {
        if(!this.sources) return null
        return html`
            <ul>
                ${this.sources.map(source => html`
                    <li>
                        <a href="#${source}" @click="${() => this._selectSource(source)}">
                            ${source}
                        </a></li>`)}
            </ul>
        `
    }

    connectedCallback() {
        super.connectedCallback()
        window.addEventListener(ClientCreated, e => this._handleClientCreated(e))
    }

    _handleClientCreated(event) {
        const {client} = event.detail
        this.client = client
        console.log('index: ', {client})
        client.from("").select().then(({data, error}) => {
            if (error) {
                console.error(error)
            } else {
                this.api = data
                // console.log({paths: data.paths})
                const sources = Object.getOwnPropertyNames(data.paths)
                    .filter(s => s !== '/')
                    // .slice(0, 5)
                    .map(s => s.substring(1))
                // console.log({sources})
                this.sources = sources
                this._selectSource(sources[1])
            }
        })
    }
}

customElements.define('supabase-index', SupabaseIndex);
