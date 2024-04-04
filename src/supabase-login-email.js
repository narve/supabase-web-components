import {html, ifDefined, ifTruthy} from './index-supabase.js';
import {SWCElement} from "./SWCElement.js";
import {ClientCreated} from "./events.js";
import {showToastMessage, toastTypes} from "./toast.js";

export class SupabaseLoginEmail extends SWCElement {

    static properties = {
        email: {state: true},
        password: {state: true},
        client: {state: true},
    }

    constructor() {
        super();
        this.email = ''
        this.password = ''
        this.client = null
    }

    async login(event) {
        event.preventDefault()
        showToastMessage(toastTypes.info, 'Logging in with email', 'E-mail: ' + this.email)
        const {data, error} = await this.client.auth.signInWithPassword({
            email: this.email,
            password: this.password,
        })
        if(error) {
            showToastMessage(toastTypes.error, 'Login failed', error.message)
        } else {
            console.log('Login success: ', data)
            showToastMessage(toastTypes.success, 'Login success', data.user.email)
        }
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener(ClientCreated, e => this.client = e.detail.client)
    }

    render() {
        const disabled = !this.client || this.email.length===0 || this.password.length === 0

        return html`
            <form>
                <fieldset>
                    <legend>Login with email</legend>
                    <label for="email">
                        <input type="email" id="email" name="email" placeholder="Email"
                               @input="${e=>this.email = e.target.value }"
                               value="${this.email}"
                        >
                    </label>
                    <label for="password">
                        <input type="password" id="password" name="password" placeholder="Password"
                               @input="${e=>this.password = e.target.value }"
                               value="${this.password}"
                        >
                    </label>
                    <label>
                        <input type="submit" value="Login" @click="${this.login}"
                               disabled="${ifTruthy(disabled)}"
                        >
                    </label>
                </fieldset>
            </form>
        `
    }
}

customElements.define('supabase-login-email', SupabaseLoginEmail);
