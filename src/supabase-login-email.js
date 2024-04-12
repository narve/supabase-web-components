import {html} from './index-externals.js';
import {SWCElement} from "./SWCElement.js";
import {UserLoggedIn} from "./events.js";
import {showToastMessage, toastTypes} from "./toast.js";
import {getFatSelect} from "./supabase-utils.js";

export class SupabaseLoginEmail extends SWCElement {

    static properties = {
        email: {state: true},
        password: {state: true},
        client: {state: true},
        user: {state: true},
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
            showToastMessage(toastTypes.success, 'Login success', data.user.email)
            this.dispatch(UserLoggedIn, {client: this.client, user: data.user})
        }
    }

    async updated(changedProperties) {
        if (changedProperties.has('client') && this.client) {
            const { data: { user } } = await this.client.auth.getUser()
            this.user = user.email
            // console.log('user: ', this.user)
        }
    }


    render() {
        const disabled = !this.client || this.email.length === 0 || this.password.length === 0
        return html`
            <form>
                <p>Current user: ${this.user}</p>
                <fieldset>
                    <legend>Login with email</legend>
                    <label for="email">
                        <input type="email" id="email" name="email" placeholder="Email"
                               @input="${e => this.email = e.target.value}"
                               value="${this.email}"
                        >
                    </label>
                    <label for="password">
                        <input type="password" id="password" name="password" placeholder="Password"
                               @input="${e => this.password = e.target.value}"
                               value="${this.password}"
                        >
                    </label>
                    <label>
                        <input type="submit" value="Login" @click="${this.login}"
                               ?disabled="${disabled}"
                        >
                    </label>
                </fieldset>
            </form>
        `
    }
}

customElements.define('supabase-login-email', SupabaseLoginEmail);
