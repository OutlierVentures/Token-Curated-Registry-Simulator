import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

// eslint-disable-next-line no-console
module.exports = app.listen(port, () => console.log(`Listening on port ${port}`));
