const layout = require('../layout');
// const { getError } = require('../../helpers');
const confirmation = Math.floor(Math.random() * 10);

console.log(confirmation);


module.exports = ({ errors }) => {
  return layout({
    content: `
      <div class="container">
        <div class="columns is-centered titleCenter">
          <div class="column is-one-quarter">
            <form method="POST">
              <h1 class="title">Thank you for your purchase</h1>
              <div class="confirm">

                <p class="confirm titleCenter">Confirmation No. ${confirmation}</p>
              </div>

            </form>
          </div>
        </div>
      </div>
    `
  });
};
