import {SWCElement} from "./index.js";
import {html} from "./index.js";
import {getSupabaseRoot} from "./index.js";
import {ClientCreated} from "./index.js";
import {ListBase} from "./list-base.js";

export class ListMySnokeResponses extends ListBase {
    static properties = {
        items: {state: true}
    }

    constructor() {
        super()
        this.source = 'snoke_response'
    }


    render() {
        const text = r => `
                ${r.full_name} - ${r.year_of_birth} - ${r.county}: 
                Formue: ${r.wealth} - Inntekt: ${r.income} - Skatt: ${r.tax}
            `
        const item = r => html`
            <li>${text(r)}</li>`
        return html`
            <ul>
                ${this.items.map(r => item(r))}
            </ul>
        `
    }
}

customElements.define('my-snoke-responses', ListMySnokeResponses);