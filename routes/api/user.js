const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const config = require('config');
const jwt = require('jsonwebtoken');


router.post(

    '/', 
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email','Please include a valid emial').isEmail(),
        check('password', 'Password is required').isLength({min: 6})
    ],
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {name,email,password} = req.body;

    try{
        // see if User exists

        //Get users gravatar

        //Engrypt password

        //Return jsonwebtoken
        let user = await User.findOne({email});

        if(user){
            return res.status(400).json({errors:[{msg: "User already exists"}]});
        }


        const avatar = gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password,salt);
        
        await user.save();
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
