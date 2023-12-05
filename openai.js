const {OpenAIClient, AzureKeyCredential} = require('@azure/openai');
const {OPENAI_URL, OPENAI_KEY, EMBEDDINGS_MODEL} = process.env;

const openAiClient = new OpenAIClient(OPENAI_URL, new AzureKeyCredential(OPENAI_KEY));

module.exports = async function (inputTextArray) {
    try {
        return (await openAiClient.getEmbeddings(EMBEDDINGS_MODEL, inputTextArray));
    } catch (err) {
        console.error(err);
    }
}