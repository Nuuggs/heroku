import express from 'express';
import pg from 'pg';

const PORT = process.env.PORT || 3004;
// Initialise Express
const app = express();

// initialize pool
const { Pool } = pg;


let pgConnectionConfigs;

// test to see if the env var is set. Then we know we are in Heroku
if (process.env.DATABASE_URL) {
  // pg will take in the entire value and use it to connect
  pgConnectionConfigs = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  };
} else {
  // this is the same value as before
  pgConnectionConfigs = {
    user: 'bryluke000',
    host: 'localhost',
    database: 'bryluke000',
    port: 5432,
  };
}
const pool = new Pool(pgConnectionConfigs);



app.set('view engine', 'ejs');

app.get('/bananas', (request, response) => {

  const responseText = `This is a random number: ${Math.random()}`;

  console.log('request came in', responseText);

  const data = { responseText };

  response.render('bananas', data);
});

app.get('/cats', (request, response) => {
  console.log('request came in');
  pool.query('SELECT * from cats').then((result) => {
    console.log(result.rows[0].name);
    response.send(result.rows);  
  }).catch((error) => {
    console.error('Error executing query', error.stack);
    response.status(503).send(result.rows);
  });;
});

app.listen(PORT);
