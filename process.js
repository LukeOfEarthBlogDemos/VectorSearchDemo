const fs = require('fs')
const path = require('path');

const fileName = 'books.txt';
const filePath = path.join(__dirname, fileName);

module.exports = function () {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const books = data.split('\n');
        return books.map((book) => {
            const fields = book.split('\t');
            return {
                // Extracting only the fields we need
                title: fields[2],
                author: fields[3],
                date_of_publication: fields[4],
                synopsis: fields[6],
            }
        });
    } catch (err) {
        console.error(err);
    }
}