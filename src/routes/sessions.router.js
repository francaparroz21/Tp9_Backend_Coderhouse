import { Router } from 'express';
import {userModel} from '../Dao/models/users.model.js';
import { createHash, validatePassword } from '../utils.js';
import passport from 'passport';

const router = Router();

router.post('/register', passport.authenticate('register', {failureREdirect:'/failregister'}), async (req, res) =>{
    res.send({status:"success", message:"User registered"});
});

router.get('/failregister', async (req, res) => {
    console.log("Failed strategy");
    res.send({error:"Error ocurred when try to register"});
})

router.post('/login', passport.authenticate('login',{failureRedirect:'/faillogin'}), async (req,res)=>{
    console.log("Llegue al router bien")
    if(!req.user) return res.status(400).send({status:"error", error: 'Invalid credentials'});

    req.session.user = {
        name: req.user.first_name,
        age: req.user.age,
        email: req.user.email,
        rol: req.user.rol
    }

    res.send({status:"success", payload:req.user, message:"Login!!!"})
});

router.get('/faillogin', async (req, res)=>{

    console.log('Failed strategy');
    res.send({error: 'Error ocurred when try to login...'});

});

router.get('/logout', (req,res)=>{
    req.session.destroy(err =>{
        if(err) return res.status(500).send({status:"error", error:"Couldn't close session"});
        res.redirect('/login');
    })
});

router.get('/github', passport.authenticate('github'), async (req,res)=>{});

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}), async (req,res)=>{
    req.session.user = req.user;
    res.redirect('/')
});

export default router;