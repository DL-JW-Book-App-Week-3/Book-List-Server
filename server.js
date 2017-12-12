'use strict';
// Server Scripts Go Below

const express = require('express');
const cors = require('cors'); // Cors helps to resolve cross source issues
const pg = require('pg');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.use(cors());

app.get('/', (req, res) => res.send('Testing 1, 2, 3'));

loadDB();

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

//export PORT=3000
//export CLIENT_URL=http://localhost:8080
//export DATABASE_URL=postgres://localhost:5432/books_app   //MAC
//export DATABASE_URL=postgres://postgres:1234@localhost:5432/books_app   //WINDOWS

/////////////////// ** DATABASE FUNCTIONS ** ///////////////////
////////////////////////////////////////////////////////////////

function loadBooks() {
  client.query('SELECT COUNT(*) FROM books_app')
    .then(result => {
      if(!parseInt(result.rows[0].count)) {
        fs.readFile('./books.json', 'utf8', (err, fd) => {
          JSON.parse(fd).forEach(ele => {
            client.query(`
              INSERT INTO
              books_app(title, author, isbn, image_url, description)
              SELECT $1, $2, $3, $4, $5;
              `,
              [ele.title, ele.author, ele.isbn, ele.image_url, ele.description]
            )
              .catch(console.error);
          })
        })
      }
    })
}

function loadDB() {
  client.query(`
    CREATE TABLE IF NOT EXISTS
    books_app (
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn TEXT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    description TEXT NOT NULL
    );`
  )
  .then(loadBooks)
  .catch(console.error);
}
