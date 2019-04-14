const express = require('express');
const bodyParser = require('body-parser');
const configRoutes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

configRoutes(app);

app.listen('3000', () => {
    console.log('Server is live on port 3000!')
});
