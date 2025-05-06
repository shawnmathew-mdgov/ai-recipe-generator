import { generateClient } from 'aws-amplify/data'

// {loading ? (
//   <div className="loader-container">
//     <p>Loading...</p>
//     <Loader size="large" />
//     <Placeholder size="large" />
//     <Placeholder size="large" />
//     <Placeholder size="large" />
//   </div>
// ) : (
//   result && <p className="result">{result}</p>
// )}

const template = document.createElement('template')
template.innerHTML = `
  <div class="app-container">
    <header class="header-container">
      <h1 class="main-header">
        Meet Your Personal
        <br />
        <span class="highlight">Recipe AI</span>
      </h1>
      <p class="description">
        Simply type a few ingredients using the format ingredient1,
        ingredient2, etc., and Recipe AI will generate an all-new recipe on
        demand...
      </p>          
    </header>
    <form class="form-container">
      <div class="search-container">
        <input
          type="text"
          name="ingredients"
          placeholder="Ingredient1, Ingredient2, Ingredient3..."
          class="wide-input"
        />
        <button type="submit" id="generate">Generate</button>
      </div>
    </form>
    <div class="result-container"></div>
  </div>
`

export class MainPage extends HTMLElement {
  #amplifyClient = generateClient({
    authMode: 'userPool'
  })

  #response = {
    data: null,
    error: null,    
  }

  constructor() {
    super()
  }

  setResponseState(data, error) {
    this.#response = {
      data,
      error
    }
  }

  resetResponseState() {
    this.#response = {
      data: null,
      error: null,    
    }
  }

  loadIngredients() {
    const form = this.querySelector('form')
    const formData = new FormData(form)
    const ingredients = formData.get('ingredients').split(',')
    return ingredients
  }
  
  loadResponse() {
    const resultContainer = this.querySelector('.result-container')
    const p = document.createElement('p')
    const { data, error } = this.#response
    p.textContent = error ? error : data
    resultContainer.appendChild(p)
  }

  async handleSubmit(e) {
    e.preventDefault()
    const ingredients = this.loadIngredients()
    // const { data: responseData } = await this.#amplifyClient.queries.askBedRock({
    //   ingredients
    // })
    // console.log(responseData)
    const responseData = await this.#amplifyClient.queries.askBedRock({
      ingredients
    })
    console.log(responseData)
    const { body: responseText, error } = responseData
    this.setResponseState(responseText, error)
    this.loadResponse()
  }  

  connectedCallback() {
    const content = template.content.cloneNode(true)
    this.appendChild(content)

    const submitButton = this.querySelector('button#generate')
    submitButton.addEventListener('click', this.handleSubmit.bind(this))
  }
}

customElements.define('main-page', MainPage)