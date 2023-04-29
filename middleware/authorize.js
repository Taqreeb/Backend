const User = require('../models/userSchema');

const isAuthorizedUser= (...roles)=>{ 
    return async (req,res,next)=>{
    const user = await User.findById(req.userId)  
    if(!roles.includes(user.role)){
       return res.json({
           message:`${user.FirstName} is not allowed to perform this operation`
       })
     }
     next();
   }
}

module.exports = isAuthorizedUser