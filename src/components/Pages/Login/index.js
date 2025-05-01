export class LoginPage extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.innerHTML = '<auth-enticate></auth-enticate>'
  }
}

customElements.define('login-page', LoginPage)