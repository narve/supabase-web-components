import {SWCElement} from "./index.js";
import {html} from "./index.js";
import {getSupabaseRoot} from "./index.js";
import {ClientCreated} from "./index.js";
import {showToastMessage, toastTypes} from "../src/index.js";

export class ListMySnokeRequests extends SWCElement {
    static properties = {
        requests: {state:true}
    }
    constructor() {
        super();
        this.requests = []
    }

    async delete(item) {
        console.log(this.constructor.name, 'delete', item)
        const client = getSupabaseRoot(this).client
        const {id} = item
        const response = await client
            .from('snoke_request')
            .delete({count:'exact'})
            .eq('id', id)
        const {error, count } = response
        if (error) {
            showToastMessage(toastTypes.error, "Error", error.message, 3000)
        } else if (count===0) {
            // await this.fetch()
            showToastMessage(toastTypes.error, "Hm... ingenting ble slettet", error.message, 3000)
        } else {
            showToastMessage(toastTypes.success, "Fjernet!", ``, 3000)
            // await this._fetch()
        }

    }


    render() {
        const text = r => `${r.full_name} - ${r.year_of_birth} - ${r.county}`
        const item = r => html`
            <li>
                ${text(r)}
                <button @click="${()=>this.delete(r)}">&#x1F5D1;</button>
            </li>`
        return html`
            <ul>
                ${this.requests.map(r => item(r))} 
            </ul>
        `
    }

    async connectedCallback() {
        super.connectedCallback()
        const root = getSupabaseRoot(this)
        // root.addEventListener('list-my-requests', async () => await this.fetch())
        root.addEventListener(ClientCreated, async () => {
            setTimeout(
                async () => {
                    await this.fetch()
                    await this.subscribe()
                },
                1)
        })
    }

    async subscribe() {
        // Initialize the JS client
        const client = getSupabaseRoot(this)?.client

        // Create a function to handle inserts
        const handleInserts = (payload) => {
            console.log('Change received!', payload)
            if(payload.eventType === 'DELETE') {
                const index = this.requests.findIndex(r => r.id === payload.old.id)
                console.log('slicing: ', index)
                this.requests.splice(index,1)
            } else {
                this.requests.push(payload.new)
            }
            this.update()
        }

        // Listen to inserts
        client
            .channel('snoke_request')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'snoke_request' },
                handleInserts)
            .subscribe()

    }

    async fetch(event) {
        const client = getSupabaseRoot(this)?.client
        // console.log(this.constructor.name, 'fetch');
        const {error, data } = await client
            .from('snoke_request')
            .select()
        this.requests = data
    }
}

customElements.define('my-snoke-requests', ListMySnokeRequests)
