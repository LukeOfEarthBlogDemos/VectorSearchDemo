const {MongoClient} = require('mongodb');
const {DB_CONNECTION} = process.env;

let client;

async function getClient() {
    if (client) return client;
    try {
        client = await MongoClient.connect(DB_CONNECTION);
        return client;
    } catch (err) {
        console.error(err);
    }
}

async function storeBook(book) {
    try {
        const client = await getClient();
        await client.db('book-test').collection('books').insertOne(book);
    } catch (err) {
        console.error(err);
    }
}

async function createSearchIndex() {
    const index = {
        mappings: {
            dynamic: false,
            fields: {
                embedding: {
                    type: 'knnVector',
                    dimensions: 1536,
                    similarity: 'cosine',
                }
            }
        }
    }

    try {
        const client = await getClient();
        await client.db('book-test').collection('books').createSearchIndex({name: 'vectorSearchIndex', definition: index});
    } catch (err) {
        console.error(err);
    }
}

async function vectorSearch(inputEmbeddings) {
    const pipeline = [
        {
            $vectorSearch: {
                // This is our input vector
                queryVector: inputEmbeddings,
                // The path to the embeddings on our records
                path: 'embedding',
                // We instruct the search algorithm to only consider the 1000 closest candidates
                numCandidates: 1000,
                // We will limit our final results to the top 5 results
                limit: 5,
                // The name of our Atlas Search Index
                index: 'vectorSearchIndex',
            },
        },
        {
            $project: {
                // We get the title, synopsis, and the special vectorSearchScore meta property
                title: 1,
                synopsis: 1,
                match_score: {
                    $meta: 'vectorSearchScore',
                },
            },
        }
    ];

    try {
        const client = await getClient();
        return await client.db('book-test').collection('books').aggregate(pipeline);
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    storeBook,
    createSearchIndex,
    vectorSearch,
}