const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', ( _ , res) => {
    res.send('account app');
});

router.get('/join', ( _ , res) => {
    res.render('accounts/join.html');
});

router.post('/join', async (req, res) => {
    try{

        await models.User.create(req.body);
        res.send('<script>alert("회원가입 성공");\
        location.href="/accounts/login";</script>');

    }catch(e){

    }
});

router.get('/login', ( _ , res) => {
    res.render('accounts/login.html');
});

module.exports = router;