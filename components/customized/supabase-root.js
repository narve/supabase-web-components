import {ClientCreated, UserLoggedIn, UserLoggedOut} from "../../src/events.js";

export class SupabaseRoot extends HTMLDivElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.addEventListener(ClientCreated, e => this.client = e.detail.client)
    }

    get client() {
        return this._client
    }

    get user() {
        return this._user
    }

    set client(client) {
        // console.log("Client connected", client);
        this._client = client;
        client.auth.onAuthStateChange((event, session) => {
            // console.log('AUTH EVENT', event, session)

            if (event === 'INITIAL_SESSION') {
                // handle initial session
            } else if (event === 'SIGNED_IN') {
                console.log('SIGNED_IN', session.user.email)
                this.dispatchEvent(new CustomEvent(UserLoggedIn, {detail: {user: session.user}}))
                this._user = session.user
            } else if (event === 'SIGNED_OUT') {
                console.log('SIGNED_OUT', event)
                this.dispatchEvent(new CustomEvent(UserLoggedOut))
                this._user = null
            } else if (event === 'PASSWORD_RECOVERY') {
                // handle password recovery event
            } else if (event === 'TOKEN_REFRESHED') {
                // handle token refreshed event
            } else if (event === 'USER_UPDATED') {
                // handle user updated event
            }
        })
        // console.log('auth data', data)

        // call unsubscribe to remove the callback
        // data.subscription.unsubscribe()
    }

}

customElements.define('supabase-root', SupabaseRoot, {extends: "div"});
