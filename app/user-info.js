import {SWCElement} from "../customized-built-in-elements/SWCElement.js";
import {html} from "../src/index-externals.js";
import {getSupabaseRoot} from "./utils.js";

export class UserInfo extends SWCElement {
    constructor() {
        super();
    }

    render() {
        const client = getSupabaseRoot(this)?.client
        const userInfo = client
            ? client.getCurrentSession()
            : ''
        return html`
        user info here: <pre>${JSON.stringify(userInfo)}</pre>
        `
    }
}

customElements.define('user-info', UserInfo);