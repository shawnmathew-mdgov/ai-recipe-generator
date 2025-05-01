const Router = {
  init: () => {    
    // Event Handler for URL changes
    window.addEventListener("popstate", event => {
        Router.go(event.state.route, false)
    })

    // Check the initial URL
    Router.go(location.pathname)
  },
  go: (route, addToHistory=true) => {
    console.log(`Going to ${route}`)

    if (addToHistory) {
        history.pushState({ route }, '', route)
    }
    let pageElement = null
    switch (route) {
      case "/":
        pageElement = document.createElement("main-page")
        break
      case "/login":
        pageElement = document.createElement("login-page")
        break
      case "/confirm":
        pageElement = document.createElement("confirm-page")
        break
      default:
        pageElement = document.createElement("login-page")
    }
    if (pageElement) {
        const cache = document.querySelector("main")
        cache.innerHTML = ""
        cache.appendChild(pageElement)
        window.scrollX = 0
        window.scrollY = 0

    } else {
        // 404
        document.querySelector("main").innerHTML = "Oups, 404!"

    }
  }
}
export default Router