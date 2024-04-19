import {SWCElement} from "./index.js";
import {html} from "./index.js";
import {getSupabaseRoot} from "./index.js";
import {UserLoggedIn, ClientCreated, UserLoggedOut} from "./index.js";
import {showToastMessage, toastTypes} from "./index.js";

export class LoginOrRegister extends SWCElement {
    static properties = {
        email: {state: true},
        password: {state: true},
        user: {state: true},
        client: {state: true},
        root: {state: true},


    }

    constructor() {
        super();
        this.email = ''
        this.password = ''
        this.user = null
        this.client = null
        this.root = null
    }

    connectedCallback() {
        super.connectedCallback()
        this.root = getSupabaseRoot(this)
        this.root.addEventListener(UserLoggedIn, async (e) => {
            setTimeout(() => {
                console.log(this.constructor.name, UserLoggedIn, e.detail.user)
                return this.user = e.detail.user;
            }, 1);
        })
        this.root.addEventListener(ClientCreated, async (e) => {
            setTimeout(() => {
                console.log(this.constructor.name, ClientCreated, e.detail.user)
                this.client = e.detail.client;
            }, 1);
        })
        this.root.addEventListener(UserLoggedOut, async (e) => {
            setTimeout(() => {
                console.log(this.constructor.name, UserLoggedOut)
                this.user = null
            }, 1);
        })
    }

    async logout() {
        const { error } = await this.client?.auth?.signOut()
    }

    async handleForm(event) {
        console.log(this.constructor.name, 'handleForm', event)
        event.preventDefault()
        const isOtp = event.submitter.value.indexOf('lenke') > 0
        if(!isOtp) {
            await this.login(this.email, this.password)
        } else if(isOtp) {
            await this.signup(this.email, this.password)
        }
    }

    async signup(email, password) {
        const {data, error} = await this.client.auth.signInWithOtp({
            email,
            password,
        })
        if (error) {
            showToastMessage(toastTypes.error, 'E-mail link request failed', error.message)
        } else {
            showToastMessage(toastTypes.success, 'Sjekk e-posten din om litt', data.user?.email)
            // this.dispatch(UserLoggedIn, {client: this.client, user: data.user})
        }

    }

    async login(email, password) {
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

    render() {
        const userInfo = this.user?.email

        const regText = this.password
            ? 'Registrer ny bruker med passord'
            : 'Registrer ny bruker'

        return !userInfo
            ? html`
                    <p>
                        Registrer deg her med din e-post. Din e-post er ikke synlig for noen, og brukes
                        kun til innlogging og til å sende deg varsler (kommer snart, kanskje :D).
                    </p>
                    <p>
                        Dersom du ønsker å være enda mer anonym, kan du bruke en e-post <i>relay</i>/<i>maskering</i>,
                        f.eks. <a href="https://relay.firefox.com" target="_blank">Firefox sin relay tjeneste</a>.
                    </p>
                    <p>
                        Dersom du angir passord, kan du logge rett inn neste gang uten å
                        vente på e-postlenke.
                    </p>
                    <p>
                        Etter at du har registrert deg, vil du få en e-post med en innloggings-lenke.
                        Lenken vil ta deg tilbake hit, ferdig innlogget.
                    </p>
                    
                    <form @submit="${this.handleForm}">
                        <fieldset>
                            <legend>Innlogging/registrering</legend>
                            <label for="email">
                                <input id="email" name="email" placeholder="Email" required type="email"
                                       @input="${e => this.email = e.target.value}">
                            </label>
                            <label for="password">
                                <input id="password" name="password" placeholder="Password" type="password"
                                       @input="${e => this.password = e.target.value}">
                            </label>
                            <label>
                                <input ?disabled="${!this.email}" type="submit" value="Få tilsendt e-postlenke">
                                <input ?disabled="${!this.email || !this.password}" type="submit" value="Logg in eksisterende bruker">
                            </label>
                        </fieldset>
                    </form>
            `
            : html`
                    <p>
                        Du er logget inn med e-postadresse ${userInfo}. 
                        <button @click="${this.logout}">Logg ut</button>
                    </p>
            `
    }
}

customElements.define('login-or-register', LoginOrRegister);