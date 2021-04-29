const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routers/admin/auth');
const adminProdRouter = require('./routers/admin/products');
const prodRouter = require('./routers/products');
const cartsRouter = require('./routers/carts');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({ keys: ['slfksjdhivjslkjvsjdbl']}));       //random string
app.use(authRouter);
app.use(prodRouter);
app.use(adminProdRouter);
app.use(cartsRouter);


app.listen(3000, () => {
  console.log("listening on port 3000");
});
