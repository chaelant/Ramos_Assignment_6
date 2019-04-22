const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const st = express.static(__dirname + '/public');
const configRoutes = require('./routes');

const app = express();

app.use('/public', st)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen('3000', () => {
    console.log('Server is live on port 3000!')
});
