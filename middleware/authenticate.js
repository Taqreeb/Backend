const jwt = require('jsonwebtoken');
require('dotenv').config();

const isAuthenticatedUser =  (req, res ,next) => {
    try{
        const token = req.header('auth-token');
        if(!token){
            return res.status(401).send({error:"Please authenticate using a valid token"});
        }
        try{
        const data = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = data._id;
        next();
        }
        catch(error){
            return res.status(401).send({error:"Please authenticate using a valid token"})
        }

    }
    catch(error){
            res.status(404).json({
                error: "You need to login first"
            })
    }
    
}

module.exports = isAuthenticatedUser
