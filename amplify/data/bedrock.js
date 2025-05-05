export function request(ctx) {
  const { ingredients = [] } = ctx

  // Construct the prompt with the provided ingredients
  const prompt = `Suggest a recipe idea using these ingredients ${ingredients.join(', ')}`

  // Return the request config
  return {
    resourcePath: `/model/anthropic.claude-3-7-sonnet-20250219-v1:0/invoke`,
    method: 'POST',
    params: {
      headers: {
        'Content-Type': 'application/json'
      },    
      body: JSON.stringify({        
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 200,
        top_k: 250,
        stop_sequences: [],
        temperature: 1,
        top_p: 0.999,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Why is the sky blue?'
              }
            ]
          }
        ]
      })
    },
  }
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