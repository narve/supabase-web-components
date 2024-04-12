import {UserLoggedIn} from "../src/events.js";
import {showToastMessage, toastTypes} from "../src/toast.js";

export class SupabaseLoginHandler extends HTMLFormElement {

    constructor() {
        super();
        console.log('constructing', this.constructor.name)
        this.addEventListener('submit', this.login)
    }

    dispatch(eventType, detail) {
        console.debug(`${this.constructor.name} dispatch`, eventType, detail)
        this.dispatchEvent(new CustomEvent(eventType, {detail, bubbles: true}))
    }

    get supabaseRoot() {
        let cur = this
        while(cur && cur.tagName !== 'SUPABASE-SITE')
            cur = cur.parentNode
        return cur
    }

    get client() {
        return this.supabaseRoot?.client
    }

    async login(event) {
        event.preventDefault()
        // console.log({root: this.supabaseRoot, client: this.client, event})
        const formData = new FormData(this);
        const email = formData.get('email')
        const password = formData.get('password')
        showToastMessage(toastTypes.startOperation, 'Logging in with email', 'E-mail: ' + email)
        const {data, error} = await this.client.auth.signInWithPassword({
            email,
            password,
        })
        if(error) {
            showToastMessage(toastTypes.error, 'Login failed', error.message)
        } else {
            showToastMessage(toastTypes.success, 'Login success', data.user.email)
            this.dispatch(UserLoggedIn, {client: this.client, user: data.user})
        }
    }
}

customElements.define('supabase-login-handler', SupabaseLoginHandler, { extends: "form" });
