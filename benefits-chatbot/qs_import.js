import weaviate from 'weaviate-client';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function transformPropertyNames(data) {
  return data.map(item => {
    const transformedItem = {};
    for (const key in item) {
      const newKey = key.match(/^[0-9]/) ? `_${key}` : key; // Prefix with underscore if key starts with a number
      transformedItem[newKey] = item[key];
    }
    return transformedItem;
  });
}

async function getJsonData() {
  const folderPath = path.join(__dirname, 'gov-json');
  const files = await fs.readdir(folderPath);
  const jsonFiles = files.filter(file => file.endsWith('.json'));

  const data = [];
  for (const file of jsonFiles) {
    const filePath = path.join(folderPath, file);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    data.push(...JSON.parse(fileContent));
  }

  return transformPropertyNames(data);
}

// Note: The TS client does not have a `batch` method yet
// We use `insertMany` instead, which sends all of the data in one request
async function importGovBenefits() {
  const govBenefits = client.collections.get('GovBenefits');
  const data = await getJsonData();
  const result = await govBenefits.data.insertMany(data);
  console.log('Insertion response: ', result);
}

await importGovBenefits();

client.close(); // Close the client connection