import {
  signIn,
  confirmSignIn,
  signUp,
} from 'aws-amplify/auth'

const template = document.createElement('template')
template.innerHTML = `
  <div>
    <section tabs>
      <p id='sign-in' active>Sign In</p>
      <p id='create-account'>Create Account</p>
    </section>
    <section tab='sign-in'>
      <form>
        <fieldset>
          <label>Email</label>
          <input type='text' name='email' />
        </fieldset>
        <fieldset>
          <label>Password</label>
          <input type='password' name='password' />
        </fieldset>        
        <button type='submit'>Sign In</button>
      </form>
    </section>
    <section tab='create-account'>
      <form>
        <fieldset>
          <label>Email</label>
          <input type='text' name='email' />
        </fieldset>
        <fieldset>
          <label>Password</label>
          <input type='password' name='password'/>
        </fieldset>
        <fieldset>
          <label>Confirm Password</label>
          <input type='password' />
        </fieldset>
        <button type='submit'>Create Account</button>
      </form>
    </section>
  </div>
`

export class AmplifyAuthenticate extends HTMLElement {
  constructor() {
    super()
  }

  removeActiveTab() {
    const activeTab = this.querySelector('[tab][active]')
    activeTab.removeAttribute('active')

    const activeTabTitle = this.querySelector('[tabs] > [active]')
    activeTabTitle.removeAttribute('active')
  }  

  setActiveTab(e) {
    const { id } = e.target
    this.removeActiveTab()

    const tab = this.querySelector(`[tab='${id}']`)
    tab.setAttribute('active', '')

    const tabTitle = this.querySelector(`[tabs] #${id}`)
    tabTitle.setAttribute('active', '')
  }

  initTabTitleEventHandlers() {
    this.querySelectorAll('[tabs] > p')
      .forEach(tab => tab.addEventListener('click', this.setActiveTab.bind(this)))
  }

  loadFormData(formId) {
    const form = this.querySelector(`[tab="${formId}"] form`)
    const formData = new FormData(form)
    const email = formData.get('email')
    const password = formData.get('password')
    return {
      email,
      password
    }
  }

  async handleSignIn(e) {
    e.preventDefault()
    const { email, password } = this.loadFormData('sign-in')
    const { isSignedIn, nextStep } = await signIn({
      username: email,
      password
    })

    if (isSignedIn && nextStep.signInStep === 'DONE') {
      plain_lang.router.go('/')
    }
  }

  async handleCreateAcct(e) {  
    e.preventDefault()
    const { email, password } = this.loadFormData('create-account')

    try {
      const {isSignUpComplete, nextStep, userId} = await signUp({
        username: email,
        password,
        options: {
          autoSignIn: true
        }
      })
      
      // Update Store
      plain_lang.store.auth = {
        isSignUpComplete,
        email
      }

      console.log(isSignUpComplete, userId, nextStep)
      
      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        plain_lang.router.go('/confirm')
      }
    } catch(error) {
      console.log(error)
    }
    
  }

  connectedCallback() {
    const tmpl = template.content.cloneNode(true)    
    this.append(tmpl)

    // Tab titles
    this.initTabTitleEventHandlers()

    // Active Tab
    const activeTabTitle = this.querySelector('[tabs] > [active]')
    const tab = this.querySelector(`[tab='${activeTabTitle.id}']`)
    tab.setAttribute('active', '')

    // Form Buttons
    const signInButton = this.querySelector('[tab="sign-in"] button')
    signInButton.addEventListener('click', this.handleSignIn.bind(this))

    const createAccountButton = this.querySelector('[tab="create-account"] button')
    createAccountButton.addEventListener('click', this.handleCreateAcct.bind(this))

  }
}

customElements.define('auth-enticate', AmplifyAuthenticate)