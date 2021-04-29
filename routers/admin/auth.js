const express = require('express');

const { handleErrors} = require('./middlewares');
const usersRepo = require('../../repositories/users');
const signinTemplate = require('../../views/admin/auth/signin');
const signupTemplate = require('../../views/admin/auth/signup');
const { requireEmail,
        requirePassword,
        requirePasswordConfirmation,
        requireEmailExsiting,
        requireValidPasswordForUser} = require('./validators')


const router = express.Router();

      router.get('/signup', (req, res) => {
        res.send(signupTemplate({req}));
      });

      // Sign up congig
      router.post('/signup',
      [
        requireEmail,
        requirePassword,
        requirePasswordConfirmation
      ], handleErrors(signupTemplate) ,
            async (req, res) => {

          const { email, password, passwordConfirmation } = req.body;

          const user = await usersRepo.create({ email, password }); //({ email: email, password: password});

        req.session.userId = user.id; // Store the ID of that user inside users cookie
        res.redirect('/admin/products');

      });

      router.get('/signoff', (req, res) => {
        req.session = null;
        res.send('You are logged off')
      });

      router.get('/signin', (req, res) => {

        res.send(signinTemplate({}));
      });

      router.post('/signin',
        [
          requireEmailExsiting,
          requireValidPasswordForUser
        ], handleErrors(signinTemplate),
          async (req, res) => {

          const { email } = req.body;
        const user = await usersRepo.getOneBy({ email });

        req.session.userId = user.id;

        res.redirect('/admin/products');

      });

  module.exports = router;
