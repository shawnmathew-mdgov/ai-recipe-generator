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

  constructor() {
    super()
  }

  loadIngredients() {
    const form = this.querySelector('form')
    const formData = new FormData(form)
    const ingredients = formData.get('ingredients').split(',')
    // const ingredients = formData.get('ingredients')
    return ingredients
  }

  async handleSubmit(e) {
    e.preventDefault()
    const ingredients = this.loadIngredients()
    const { data, errors } = await this.#amplifyClient.queries.askBedRock({
      ingredients: [...ingredients]
      // ingredients
    })

    console.log(data, errors)
  }

  connectedCallback() {
    const content = template.content.cloneNode(true)
    this.appendChild(content)

    const submitButton = this.querySelector('button#generate')
    submitButton.addEventListener('click', this.handleSubmit.bind(this))
  }
}

customElements.define('main-page', MainPage)