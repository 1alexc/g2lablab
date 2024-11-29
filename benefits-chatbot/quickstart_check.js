import weaviate from 'weaviate-client';
import dotenv from 'dotenv';

dotenv.config();
// Best practice: store your credentials in environment variables
const wcdUrl = process.env.WCD_URL
const wcdApiKey = process.env.WCD_API_KEY

const client = await weaviate.connectToWeaviateCloud(
  wcdUrl, // Replace with your Weaviate Cloud URL
  {
    authCredentials: new weaviate.ApiKey(wcdApiKey), // Replace with your Weaviate Cloud API key
  }
);

var clientReadiness = await client.isReady();
console.log(clientReadiness); // Should return `true`

client.close(); // Close the client connection