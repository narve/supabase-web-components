import {SWCElement} from "../components/SWCElement.js";
import {html} from "../src/index-externals.js";
import {getSupabaseRoot} from "./utils.js";
import {ClientCreated} from "../src/events.js";

export class MySnokeResponses extends SWCElement{
    static properties = {
        items: {state:true}
    }
    constructor() {
        super()
        this.items = []
    }

    async connectedCallback() {
        super.connectedCallback()
        // super.connectedCallback();
        const root = getSupabaseRoot(this)
        // console.log(this.constructor.name, 'connectedCallback', root);
        // root.addEventListener('list-my-requests', async () => await this.fetch())
        root.addEventListener(ClientCreated, async () => {
            setTimeout(async () => await this.fetch(), 1);
        })
    }

    async fetch(event) {
        const client = getSupabaseRoot(this)?.client
        // console.log(this.constructor.name, 'fetch');
        const {error, data } = await client
            .from('snoke_response')
            .select()
        this.items = data
    }

    render() {
        const text = r => `
                ${r.full_name} - ${r.year_of_birth} - ${r.county}: 
                Formue: ${r.wealth} - Inntekt: ${r.income} - Skatt: ${r.tax}
            `
        const item = r => html`<li>${text(r)}</li>`
        return html`
            <ul>
                ${this.items.map(r => item(r))}
            </ul>
        `
    }
}

customElements.define('my-snoke-responses', MySnokeResponses);