import { defineBackend } from '@aws-amplify/backend'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { auth } from './auth/resource'
import { data } from './data/resource'

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
})

const bedrockDataSource = backend.data.resources.graphqlApi.addHttpDataSource(  
  'BedrockDataSource',
  'https://bedrock-runtime.us-east-1.amazonaws.com',
  {
    authorizationConfig: {
      signingRegion: 'us-east-1',
      signingServiceName: 'bedrock'
    }
  }
)

bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    resources: [
      'arn:aws:bedrock:us-east-1::foundation-model/amazon.nova-lite-v1:0'
    ],
    actions: ['bedrock:InvokeModel']
  })
)
