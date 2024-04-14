import {html} from "../src/index-externals.js";
import {getSupabaseRoot} from "./utils.js";
import {ClientCreated} from "../src/events.js";
import {SWCElement} from "../customized-built-in-elements/SWCElement.js";
import {showToastMessage, toastTypes} from "../src";

export class OpenSnokeRequest extends SWCElement{
    static properties = {
        requests: {state:true}
    }
    constructor() {
        super()
        this.requests = []
    }

    connectedCallback(){
        super.connectedCallback()
        const root = getSupabaseRoot(this)
        root.addEventListener(ClientCreated, async () => {
            setTimeout(async () => await this.fetch(), 1);
        })

    }

    async fetch() {
        const client = getSupabaseRoot(this)?.client
        const {error, data } = await client
            .from('open_snoke_requests')
            .select()
            .limit(5)
        this.requests = data
    }

    async openResponseDialog(item) {
        const dialog = this.dialog
        ; ['snoke_request_id', 'full_name', 'year_of_birth', 'county'].forEach( n => {
            const input = dialog.querySelector(`[name='${n}']`)
            if(input)
                input.value = item[n]
        })

        console.log('openResponseDialog', item, dialog)
        dialog.showModal()
    }

    async registerResponse(event) {
        event.preventDefault()
        // const dialog = event.target
        // console.log('register-response', event, this.dialog)
        const formData = new FormData(event.target)
        const object = Object.fromEntries(formData);
        // const object = {};
        // formData.forEach((value, key) => object[key] = value);
        console.log('register-response', object)

        const client = getSupabaseRoot(this).client
        const {data, error} = await client
            .from('snoke_response')
            .insert(object)
            .select()
        if(error) {
            showToastMessage(toastTypes.error, 'Noe gikk gale', error.message, 3000)
        } else {
            showToastMessage(toastTypes.success, 'Lagret!')
            this.dialog.close()
        }
    }

    get dialog() {
        return this.querySelector('dialog')
    }

    render() {
        const text = r => `${r.created_at} ${r.full_name} - ${r.year_of_birth} - ${r.county}`
        const item = r => html`
            <li style="cursor: pointer" @click="${() => this.openResponseDialog(r)}">${text(r)}
            </li>`
        //             <button >Registrer SNOKING</button>
        return html`
            <dialog>
                <p>Korriger feltene og fyll ut skatteinformasjon her!</p>
                <form method="dialog" @submit="${this.registerResponse}">
                    <input type="hidden" name="snoke_request_id">
                    <label>Fullt navn: 
                        <input required name="full_name">
                    </label>
                    <label>
                        Fødselsår: 
                        <input required type="number" name="year_of_birth">
                    </label>
                    <label>
                        Kommune 
                        <input required name="county">
                    </label>
                    <label>
                        Formue: 
                        <input required type="number" name="wealth">
                    </label>
                    <label>
                        Inntekt: 
                        <input required type="number" name="income">
                    </label>
                    <label>
                        Skatt: 
                        <input required type="number" name="tax">
                    </label>
                    <button>Registrer</button>
                    <button type="button" @click="${()=>this.dialog.close()}">Avbryt</button>
                </form>
            </dialog>

            <ul>
                ${this.requests.map(r => item(r))}
            </ul>
            <button @click="${this.fetch}">Hent på nytt</button>
            (listen er tilfeldig så du kan få nye navn hvis du henter listen på nytt)
        `
    }
}

customElements.define('open-snoke-requests', OpenSnokeRequest);