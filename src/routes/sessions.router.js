import { Router } from 'express';
import {userModel} from '../Dao/models/users.model.js';

const router = Router();

router.post('/register', async (req, res) =>{

    const {first_name, last_name, email, age, password} = req.body;
    try{
        const exist = await userModel.findOne({email});
    
        if(exist || email === "adminCoder@coder.com"){
            return res.status(400).send({status:"error", error:"User already exists"});
        }
    
        const user = {
            first_name,
            last_name,
            email,
            age,
            password,
            rol: "user"
        };
    
        const result = await userModel.create(user);
        res.send({status:"succes", message:"User registered"});

    }catch(error) {
        console.log('Cannot register with mongoose: '+error)
        res.status(500).send('Internal server error');
    }
});

router.post('/login', async (req,res)=>{
    const { email, password } = req.body;
    let user;

    try{
        
        if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
            user = {
                first_name: 'Administrador',
                last_name: 'Del Sistema',
                email: email,
                age: 99,
                rol: 'admin'
            };
        }else{
            user = await userModel.findOne({email,password});
        }

        if(!user){
            return res.status(400).send({status:"error", error:"Invalid data"})
        }
      
        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            rol: user.rol
        }
        res.send({status:"success", payload:req.session.user, message:"Welcome!"})
    }catch(error) {
        console.log('Cannot login with mongoose: '+error)
        res.status(500).send('Internal server error');
    }
});

router.get('/logout', (req,res)=>{
    req.session.destroy(err =>{
        if(err) return res.status(500).send({status:"error", error:"Couldn't close session"});
        res.redirect('/login');
    })
})

export default router;