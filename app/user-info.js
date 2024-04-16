import {SWCElement} from "../components/SWCElement.js";
import {html} from "../src/index-externals.js";
import {getSupabaseRoot} from "./utils.js";
import {ClientCreated, UserLoggedIn, UserLoggedOut} from "../src/events.js";

export class UserInfo extends SWCElement {
    static properties = {
        user: {state:true},
        client: {state:true},
        root: {state:true},
    }
    constructor() {
        super();
        this.user = null
        this.client = null
        this.root = null
    }

    connectedCallback() {
        super.connectedCallback()
        this.root = getSupabaseRoot(this)
        this.root.addEventListener(UserLoggedIn, async (e) => {
            setTimeout( () => {
                console.log(this.constructor.name, UserLoggedIn, e.detail.user)
                return this.user = e.detail.user;
            }, 1);
        })
        this.root.addEventListener(ClientCreated, async (e) => {
            setTimeout( () => {
                console.log(this.constructor.name, ClientCreated, e.detail.user)
                this.client = e.detail.client;
            }, 1);
        })
        this.root.addEventListener(UserLoggedOut, async (e) => {
            setTimeout( () => {
                console.log(this.constructor.name, UserLoggedOut)
                this.user = null
            }, 1);
        })
    }

    async logout() {
        const { error } = await this.client?.auth?.signOut()
    }

    render() {
        const userInfo = this.user?.email
        if(userInfo) {
            return html`
                <p>
                    Logged in as: ${userInfo}
                    <button @click="${this.logout}">Log out</button>
                </p>
            `
        } else {
            return html`
                <p>
                    Not logged in
                </p>
            `
        }
    }
}

customElements.define('user-info', UserInfo);