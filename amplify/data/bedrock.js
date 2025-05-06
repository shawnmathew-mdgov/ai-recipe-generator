export function request(ctx) {
  // const { ingredients = [] } = ctx.args
  const ingredients = ctx.args?.ingredients || []

  // Construct the prompt with the provided ingredients
  const prompt = `Suggest a recipe idea using these ingredients ${ingredients.join(', ')}`

  // Return the request config
  return {
    resourcePath: `/model/amazon.nova-lite-v1:0/invoke`,
    method: 'POST',  
    params: {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "inferenceConfig": {
          "max_new_tokens": 1000
        },
        "messages": [
          {
            "role": "user",
            "content": [
              { 
                text: prompt
              }
            ]
          }
        ]
      })
    }  
  }
}

export function response(ctx) {
  // Parse response body
  const parsedBody = JSON.parse(ctx.result.body)

  // Extract the text content from response
  const res = {
    body: parsedBody.output.message.content[0].text
  }

  return res
}