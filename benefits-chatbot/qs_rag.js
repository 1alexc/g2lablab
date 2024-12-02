import weaviate from 'weaviate-client';
import dotenv from 'dotenv';

dotenv.config();

// Best practice: store your credentials in environment variables
const wcdUrl = process.env.WCD_URL
const wcdApiKey = process.env.WCD_API_KEY
const cohereKey = process.env.COHERE_APIKEY

const client = await weaviate.connectToWeaviateCloud(
  wcdUrl, // Replace with your Weaviate Cloud URL
  {
    authCredentials: new weaviate.ApiKey(wcdApiKey), // Replace with your Weaviate Cloud API key
    headers: {
      'X-Cohere-Api-Key': cohereKey, // Replace with your Cohere API key
    },
  }
);

const govBenefits = client.collections.get('GovBenefits');

const result = await govBenefits.generate.nearText(
  'toilet',
  {
    groupedTask: 'explain how this could effect a persons benefit claim',
  },
  {
    limit: 2,
  }
);

console.log(result.generated);

client.close(); // Close the client connection