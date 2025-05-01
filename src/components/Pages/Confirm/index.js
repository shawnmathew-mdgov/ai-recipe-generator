import {
  confirmSignUp,
  resendSignUpCode,
  signIn,
  autoSignIn,
} from 'aws-amplify/auth'
import styles from './styles.css?inline'

const template = document.createElement('template')
template.innerHTML = `
  <div>
    <h2>We emailed You</h2>
    <p>
      Your code is on the way. To log in, enter the code we emailed to {{email}}. It may
      take a minute to arrive.
    </p>
    <form id='confirm'>
      <label>Confirmation Code</label>
      <input type='text' placeholder='Enter Code' name='code'>      
      <button id='confirm-code'>Confirm</button>
      <button id='resend-code'>Resend Code</button>
    </form>
  </div>
`

export class ConfirmPage extends HTMLElement {
  #code
  #username = plain_lang.store.auth.email


  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })

    const css = document.createElement('style')
    css.textContent = styles
    this.root.appendChild(css)    
  }

  setCode() {
    const formData = new FormData(this.root.querySelector('form#confirm'))
    const code = formData.get('code')
    this.#code = code
  }

  async handleConfirmCode(e) {
    e.preventDefault()

    this.setCode()

    const { nextStep: confirmSignUpNextStep } = await confirmSignUp({
      username: this.#username,
      confirmationCode: this.#code
    })

    console.log({
      confirmSignUpNextStep
    })
    
    if (confirmSignUpNextStep.signUpStep === 'COMPLETE_AUTO_SIGN_IN') {
      const { nextStep } = await autoSignIn()
      console.log(nextStep)
      if (nextStep.signInStep === 'DONE') {
        plain_lang.router.go('/')
      }
    }
  }

  async handleResendCode(e) {
    e.preventDefault()
    console.log(plain_lang.store.auth)

    const resendInfo = await resendSignUpCode({
      username: plain_lang.store.auth.email
    })

    console.log(resendInfo)
  }

  connectedCallback() {
    const content = template.content.cloneNode(true)
    this.root.appendChild(content)

    const confirmButton = this.root.querySelector('#confirm-code')
    confirmButton.addEventListener('click', this.handleConfirmCode.bind(this))

    const resendCodeButton = this.root.querySelector('#resend-code')
    resendCodeButton.addEventListener('click', this.handleResendCode.bind(this))
  } 
}

customElements.define('confirm-page', ConfirmPage)