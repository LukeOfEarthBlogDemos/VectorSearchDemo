require('dotenv').config();

const getEmbeddings = require('./openai');
const {vectorSearch} = require('./mongo');

const query = 'A fantasy story involving epic battles and magic, set in a mystical and wondrous world.';

async function findRecommendations() {
    const inputEmbeddings = await getEmbeddings([query]);
    const cursor = await vectorSearch(inputEmbeddings.data[0].embedding);
    const results = await cursor.toArray();
    console.log(results);
}

findRecommendations();