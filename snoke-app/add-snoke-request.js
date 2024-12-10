import {getSupabaseRoot} from "./index.js";
import {showToastMessage, toastTypes} from "./index.js";

export class SnokeRequest extends HTMLFormElement {
    constructor() {
        super();
        // console.log('Constructing: ', this.constructor.name)
        this.addEventListener('submit', e => this.handle(e))
    }

    async handle(event) {
        event.preventDefault()
        const formData = new FormData(this);
        const full_name = formData.get('full_name')
        const year_of_birth = formData.get('year_of_birth')
        const county = formData.get('county')
        const obj = {
            full_name,
            year_of_birth: year_of_birth.length > 0 ? parseInt(year_of_birth) : null,
            county
        }

        const client = getSupabaseRoot(this)?.client
        console.log(this.constructor.name, {client, event})
        const {error, data} = await client
            .from('snoke_request')
            .insert(obj)
            .select()
        if (error) {
            showToastMessage(toastTypes.error, 'Noe gikk gale', error.message, 3000)
        } else {
            showToastMessage(toastTypes.success, 'Lagret!')
            this.dispatchEvent(new CustomEvent('list-my-requests', {bubbles: true}))
        }
    }
}

customElements.define('snoke-request-submission', SnokeRequest, {extends: "form"});
