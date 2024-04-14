import {ClientCreated} from "../src/events.js";

export class SupabaseRoot extends HTMLDivElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.addEventListener(ClientCreated, e => this.client = e.detail.client)
    }

    set client(client) {
        console.log("Client connected", client);
        this._client = client;
    }

    get client() {
        return this._client;
    }
}

customElements.define('supabase-root', SupabaseRoot, {extends: "div"});
