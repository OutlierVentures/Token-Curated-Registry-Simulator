import express from 'express';

const app = express();
const port = 3000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/contracts', express.static(__dirname + '/contracts'));

// eslint-disable-next-line no-console
module.exports = app.listen(port, () => console.log(`Listening on port ${port}`));
