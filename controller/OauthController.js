require('dotenv').config()

var {google} = require('googleapis');
const { Users } = require('../database/models');
const jwt = require('jsonwebtoken')

const oauth2client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'http://localhost:3000/api/v1/auth/google/callback'
  )

const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
    ]
    
const authorizationUrl = oauth2client.generateAuthUrl({
      access_type:'offline',
      scope:scopes,
      include_granted_scopes:true
    })
    
const OauthRegister = async(req,res, next)=>{

  try {
    res.redirect(authorizationUrl);
  } catch (error) {
    next(error)
  }
    

}

const OauthCallback = async(req,res, next)=>{


  try {
    const {code} = req.query
  
    const {tokens} = await oauth2client.getToken(code);
  
   
    oauth2client.setCredentials(tokens);
   
  
    const oauth2 = google.oauth2({
      auth:oauth2client,
      version:'v2'
    })
  
  
    const {data} = await oauth2.userinfo.get();
  
    if(!data){
      return res.json({
        data:data
      })
    }

    let userExist = await Users.findOne({
      where : {
        email:data.email
      }
    })

    if(!userExist){
      userExist = await Users.create({
        name:data.name,
        email:data.email,
        role : "MEMBER"
      })
    }

    const token = jwt.sign(
      { email: data.email, id: userExist.id, role:userExist.role},
      process.env.JWT_SECRET)



    return res.status(200).json({
      message:'Login Success',
      data :{
        user:{
          name:userExist.name,
          email:userExist.email},
        token:token
      }

    })
  } catch (error) {
    next(error)
  }
   
  
    
   


}

module.exports={ OauthRegister, OauthCallback}