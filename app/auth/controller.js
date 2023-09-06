const User = require ('../user/model')
const bcrypt = require ('bcrypt')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../config')
const {getToken} = require('../../utils/index')

const register = async(req, res, next) => {
   console.log(req.body)
    try{
        const payload = req.body
        let user = new User(payload)
        console.log(user);
        console.log("user");
        await user.save()
        return res.json(user)
    }catch(err){
        console.log('err');
        console.log(err);
        if(err && err.name === 'ValidationError')
        return res.json({
            error: 1,
            message: err.message,
            fields: err.errors
        })
        next(err)
    }
}

const localStrategy = async (email, password, done) => {
    try{
        const user = await User
        .findOne({email})
        .select('-__v -token -createdAt -updatedAt -cart_items')
    if(!user) return done()
    if(bcrypt.compareSync(password, user.password)){
        ({password, ...userWithoutPassword} = user.toJSON())
        return done(null, userWithoutPassword)
    }
    }catch(err){
        done(err, null)
    }
    done()
}

const login = async (req, res , next) =>{
    passport.authenticate('local', async function(err, user){
        if(err) return next(err)
        if(!user) return res.json({error: 1, message: 'Email or Password incorect'})
        let signed = jwt.sign(user, config.secretkey)
        await User.findByIdAndUpdate(user._id,{$push: {token: signed}})
        
        return res.json({
            message: 'Login Succesfully',
            user,
            token: signed
        })
    })(req,res,next)
}

const logout = async(req, res, next) => {
    let token = getToken(req)
    let user = await User.findOneAndUpdate(
        { token: { $in: [token] } },
        { $pull: { token: token } },
        { useFindAndModify: false }
      );

    if(!token || !user){
        return res.json({
            error: 1,
            message: 'No User Found'
        })
    }
    return res.json({
        error: 0,
        message: 'Logout Berhasil'
    })
}

const me = (req, res, next) => {
    
    if(!req.user){
        return res.json({
            err: 1,
            message: `you're not login or token expired`
        })
    } return res.json (req.user)
}

module.exports = {
    register,
    localStrategy,
    login,
    logout,
    me
}