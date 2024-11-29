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

// Load data
async function getJsonData() {
  const file = await fetch(
    'https://raw.githubusercontent.com/weaviate-tutorials/quickstart/main/data/jeopardy_tiny.json'
  );
  return file.json();
}

// Note: The TS client does not have a `batch` method yet
// We use `insertMany` instead, which sends all of the data in one request
async function importQuestions() {
  const questions = client.collections.get('Question');
  const data = await getJsonData();
  const result = await questions.data.insertMany(data);
  console.log('Insertion response: ', result);
}

await importQuestions();

client.close(); // Close the client connection