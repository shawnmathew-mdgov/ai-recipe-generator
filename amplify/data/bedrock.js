export function request(ctx) {
  const { ingredients = [] } = ctx

  // Construct the prompt with the provided ingredients
  const prompt = `Suggest a recipe idea using these ingredients ${ingredients.join(', ')}`

  // Return the request config
  return { ...claudeRequest }
}

export function response(ctx) {
  // Parse response body
  // const parsedBody = JSON.parse(ctx.result.body)
  const parsedBody = JSON.parse(ctx)

  // Extract the text content from response
  const res = {
    // body: parsedBody.content[0].text
    body: parsedBody
  }

  return res
}