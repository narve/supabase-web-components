import {UserLoggedIn} from "../../src/events.js";
import {showToastMessage, toastTypes} from "../../src/toast.js";
import {getSupabaseRoot} from "../../src/utils.js";

export class SupabaseSignupHandler extends HTMLFormElement {

    constructor() {
        super();
        // console.log('constructing', this.constructor.name)
        this.addEventListener('submit', e => this.handle(e))
    }

    // dispatch(eventType, detail) {
    //     console.debug(`${this.constructor.name} dispatch`, eventType, detail)
    //     this.dispatchEvent(new CustomEvent(eventType, {detail, bubbles: true}))
    // }


    get client() {
        return getSupabaseRoot(this)?.client
    }

    async handle(event) {
        event.preventDefault()
        console.log('signup-handler: ', {root: this.supabaseRoot, client: this.client, event})
        const emailRedirectTo = document.location.href
        const formData = new FormData(this);
        const email = formData.get('email')
        // const password = formData.get('password')
        showToastMessage(toastTypes.startOperation, 'Requesting email link', 'E-mail: ' + email)
        const {data, error} = await this.client.auth.signInWithOtp({
            email,
            // password,
            options: {
                emailRedirectTo
            }
        })
        if (error) {
            showToastMessage(toastTypes.error, 'E-mail link request failed', error.message)
        } else {
            showToastMessage(toastTypes.success, 'E-mail link request success', data.user?.email)
            // this.dispatch(UserLoggedIn, {client: this.client, user: data.user})
        }
    }
}

customElements.define('supabase-signup-handler', SupabaseSignupHandler, {extends: "form"});
