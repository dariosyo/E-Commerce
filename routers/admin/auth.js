const express = require('express');
const { check, validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users');
const signinTemplet = require('../../views/admin/auth/signin');
const signupTemplet = require('../../views/admin/auth/signup');
const { requireEmail,
        requirePassword,
        requirePasswordConfirmation,
        requireEmailExsiting,
        requireValidPasswordForUser} = require('./validators')


const router = express.Router();

      router.get('/signup', (req, res) => {
        res.send(signupTemplet({req}));
      });

      // Sign up congig
      router.post('/signup',
      [
        requireEmail,
        requirePassword,
        requirePasswordConfirmation
      ],
      async (req, res) => {
          const errors = validationResult(req);
          console.log(errors);
          if(!errors.isEmpty()){
            return res.send(signupTemplet({ req, errors }));
          }
          const { email, password, passwordConfirmation } = req.body;

          const user = await usersRepo.create({ email, password }); //({ email: email, password: password});

        req.session.userId = user.id; // Store the ID of that user inside users cookie

        res.send('Account created');
      });

      router.get('/signoff', (req, res) => {
        req.session = null;
        res.send('You are logged off')
      });

      router.get('/signin', (req, res) => {

        res.send(signinTemplet({}));
      });

      router.post('/signin',
        [
          requireEmailExsiting,
          requireValidPasswordForUser
        ],
          async (req, res) => {

          const errors = validationResult(req);
          if(!errors.isEmpty()){
            return res.send(signinTemplet({ errors }))
          }


          const { email } = req.body;
        const user = await usersRepo.getOneBy({ email });

        req.session.userId = user.id;

        res.send("You are logged in");
      });

  module.exports = router;
