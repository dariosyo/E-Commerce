const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routers/admin/auth');
const prodRouter = require('./routers/admin/products');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({ keys: ['slfksjdhivjslkjvsjdbl']}));       //random string
app.use(authRouter);
app.use(prodRouter);


app.listen(3000, () => {
  console.log("listening on port 3000");
});
