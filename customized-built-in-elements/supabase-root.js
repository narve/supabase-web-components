import {ClientCreated} from "../src/events.js";

export class SupabaseRoot extends HTMLDivElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.addEventListener(ClientCreated, e => this.client = e.detail.client)
    }

    set client(client) {
        // console.log("Client connected", client);
        this._client = client;


        const { data } = client.auth.onAuthStateChange((event, session) => {
            console.log('AUTH EVENT', event, session)

            if (event === 'INITIAL_SESSION') {
                // handle initial session
            } else if (event === 'SIGNED_IN') {
                // handle sign in event
            } else if (event === 'SIGNED_OUT') {
                // handle sign out event
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

    get client() {
        return this._client;
    }
}

customElements.define('supabase-root', SupabaseRoot, {extends: "div"});
