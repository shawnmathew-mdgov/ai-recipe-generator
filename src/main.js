import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json'
import './components/index.js'
import Router from './services/Router.js'
import Store from './services/Store.js'

(function () {
  // Configure Amplify client
  Amplify.configure(outputs)

  window.plain_lang = {}
  plain_lang.store = Store
  plain_lang.router = Router

  // Set landing page as login
  plain_lang.router.init('/login')

})()


