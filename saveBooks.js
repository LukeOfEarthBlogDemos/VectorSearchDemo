require('dotenv').config();

const getBooks = require('./process');
const getEmbeddings = require('./openai');
const {storeBook, createSearchIndex} = require('./mongo');
async function saveBooks() {
    const books = getBooks();
    for (const book of books) {
        // Skip the book if the synopsis is too long or synopsis is missing
        if (!(book.synopsis) || countTokens(book.synopsis) > 8191) {
            continue;
        }
        // Note that we only want to pass an array of book synopses to our model, NOT the whole book record
        const embeddingsResponse = await getEmbeddings(book.synopsis);
        book.embedding = embeddingsResponse.data[0].embedding;
        await storeBook(book);
    }
    await createSearchIndex();
}

function countTokens(inputString) {
    return inputString.split(/\s+/).length;
}

saveBooks();