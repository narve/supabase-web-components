import {html} from './index-supabase.js';
import {SWCElement} from "./SWCElement.js";
import {ClientCreated} from "./events.js";

export class SupabaseLoginEmail extends SWCElement {

    static properties = {
        email: {state: true},
        password: {state: true},
    }

    constructor() {
        super();
        this.email = ''
        this.password = ''
        this.client = null
    }

    login(event) {
        event.preventDefault()
        this.client.auth.signInWithPassword({
            email: this.email,
            password: this.password,
        })
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener(ClientCreated, e => this.client = e.detail.client)
    }

    render(){
        return html`
            <form>
                <fieldset>
                    <legend>Login with email</legend>
                    <label for="email">
                        <input type="email" id="email" name="email" placeholder="Email">
                    </label>
                    <label for="password">
                        <input type="password" id="password" name="password" placeholder="Password">
                    </label>
                    <label>
                        <input type="submit" value="Login" @click="${this.login}">
                    </label>
                </fieldset>
            </form>
        `
    }
}
customElements.define('supabase-login-email', SupabaseLoginEmail);
