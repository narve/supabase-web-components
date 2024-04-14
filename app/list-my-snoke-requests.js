import {SWCElement} from "../customized-built-in-elements/SWCElement.js";
import {html} from "../src/index-externals.js";
import {getSupabaseRoot} from "./index.js";
import {ClientCreated} from "../src/events.js";

export class ListMySnokeRequests extends SWCElement {
    static properties = {
        requests: {state:true}
    }
    constructor() {
        super();
        this.requests = []
    }

    render() {
        const text = r => `${r.full_name} - ${r.year_of_birth} - ${r.county}`
        const item = r => html`<li>${text(r)}</li>`
        return html`her kommer listen: 
            <ul>
                ${this.requests.map(r => item(r))}
            </ul>
            `
    }

    async connectedCallback() {
        super.connectedCallback()
        // super.connectedCallback();
        const root = getSupabaseRoot(this)
        console.log(this.constructor.name, 'connectedCallback', root);
        root.addEventListener('list-my-requests', async () => await this.fetch())
        root.addEventListener(ClientCreated, async () => {
            setTimeout(async () => await this.fetch(), 1);
        })
    }

    async fetch(event) {
        const client = getSupabaseRoot(this)?.client
        console.log(this.constructor.name, 'fetch');
        const {error, data } = await client
            .from('snoke_request')
            .select()
        this.requests = data
    }
}

customElements.define('my-snoke-requests', ListMySnokeRequests)
