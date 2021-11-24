const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Profile = require('../../models/profile');
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');


router.get('/me', auth, async (req, res) => {
    try{
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate(
            'user',['name', 'avatar']
        );

        if(!profile){
            return res.status(400).json({msg:'no profile for the user'});
        }

        res.json(profile);
    }catch (err){
        console.error(err.message);
        res.status(500).json({msg:'Server error: ' + err.message});
    }
});

router.post('/', 
    [
        auth, 
        check('status', 'Status is requried').not().isEmpty(),
        check('skills', 'Skills is requried').not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook,

          } = req.body;
        
          const profileFields = {};
          profileFields.user = req.user.id;
          if(website) profileFields.company = company;
          if(website) profileFields.website = website;
          if(location) profileFields.location = location;
          if(bio) profileFields.bio = bio;
          if(status) profileFields.status = status;
          if(githubusername) profileFields.githubusername = githubusername;
          if(skills) {
              profileFields.skills = skills.split(',').map(skill => skill.trim());
          }
        // console.log(typeof skills);
          
          profileFields.social = { }
          if(youtube) profileFields.social.youtube = youtube;
          if(twitter) profileFields.social.twitter = twitter;
          if(instagram) profileFields.social.instagram = instagram;
          if(linkedin) profileFields.social.linkedin = linkedin;
          if(facebook) profileFields.social.facebook = facebook;
          try{
            let profile = await Profile.findOne({user: req.user.id});
            if(profile){
                profile = await Profile.findOneAndUpdate(
                    {user: req.user.id}, 
                    {$set: profileFields},
                    {new: true});
                    return res.json(profile);
            }
            profile = new Profile(profileFields);
            await profile.save();
            re.json(profile);

          }catch(err){
              console.error(err.message);
              res.status(500).send('Server Bad')
          }
          res.send('Hello');
    }
    );

// @route Get api/profile
router.get('/', async (req, res) =>{
    try {
        const profile = await Profile.find().populate('user', ['name','avatar']);
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
        
    }
})

// @route Get api/profile/user
router.get('/user/:user_id', async (req, res) =>{
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name','avatar']);
        if(!profile){
            return res.status(400).json({msg:"No profile"});
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
        
    }
})

module.exports = router;
