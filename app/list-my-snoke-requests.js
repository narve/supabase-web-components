import {html} from "./index.js";
import {ListBase} from "./list-base.js";

export class ListMySnokeRequests extends ListBase {
    static properties = {
        items: {state: true}
    }

    constructor() {
        super();
        this.source = 'my_open_snoke_requests'
        this.subscribeSource = 'snoke_request'
    }


    render() {
        const text = r => `${r.full_name} - ${r.year_of_birth} - ${r.county}`
        const item = r => html`
            <li>
                <button @click="${() => this.delete(r)}">&#x1F5D1;</button>
                ${text(r)}
            </li>`
        this.log({items: this.items})
        return html`
            <ul>
                ${this.items.map(r => item(r))}
            </ul>
        `
    }
}

customElements.define('my-snoke-requests', ListMySnokeRequests)
