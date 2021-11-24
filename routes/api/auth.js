const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');


router.get('/',auth, async (req, res) => {
    try{
        //exclude c and d;
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.post(

    '/', 
    [
        check('email','Please include a valid emial').isEmail(),
        check('password', 'Password is required').isLength({min: 6})
    ],
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email,password} = req.body;

    try{
        // see if User exists

        //Get users gravatar

        //Engrypt password

        //Return jsonwebtoken
        let user = await User.findOne({email});



        if(!user){
            res.status(400).json({errors:[{msg: "Invalid credential"}]})
        }


        const isMatch = await bcrypt.compare(password, user.password);
        
        if(!isMatch){
            res.status(400).json({errors:[{msg: "Invalisd Password"}]})
        }

        const payload = {
            user:{
                id:user.id
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            {expiresIn: 360000},
            (err,token) => {
                if(err) throw err;
                res.json({token});
            }
        );
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }

    console.log(req.body);
}
);

module.exports = router;

