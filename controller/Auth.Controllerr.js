require('dotenv').config()

const { Users, sequelize } = require('../database/models');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const register = async(req,res,next)=>{
    let transaction
    try {
        transaction = await sequelize.transaction();
        const{
            name,email,password
        } = req.body

        const userExist = await Users.findOne({
            where:{email:email}
        })
        if(userExist){
            return res.status(409).json({
                message : 'Email already Exist'
            })
        }


        const hashPassword = await bcrypt.hash(password,10)
        const user = await Users.create(
            {
                name,
                email,
                password: hashPassword,
                role:"MEMBER"
            },
            { transaction }
        )
        await transaction.commit();
        return res.status(201).json({
            message:'User registration has successful',
            data: user,
        })

       
    } catch (error) {
        await transaction.rollback();
        next(error)
    }
}




const login = async(req,res,next)=>{
    let transaction
    try {
        transaction = await sequelize.transaction();
        const{
            email,password
        } = req.body
        const userExist = await Users.findOne({
            where:{
                email:email,
                
            }
        })
        if(!userExist){
            return res.status(409).json({
                message : 'User not exist'
            })
        }

        console.log(userExist.password)

        const isPasswordValid = await bcrypt.compare(password, userExist.password)

        if(!isPasswordValid){
            return res.status(404).json({
                message: 'Password not valid',
            })
        }
        
        const token = jwt.sign(
            { email: userExist.email, user_id: userExist.id, role: userExist.role },
            process.env.JWT_SECRET)
      

      
        return res.status(201).json({
            message:'Login Success',
            data: {
                token : token,
                user : userExist
            },
        })

       
    } catch (error) {
        next(error)
    }
}

const UpdatePassword = async(req,res,next)=>{
    let transaction
    try {
        transaction = await sequelize.transaction();
        const{
           password
        } = req.body
        const userExist = await Users.findOne({
            where:{
                id:req.id,
                
            }
        })

        if(!userExist){
            return res.status(409).json({
                message : 'User not exist'
            })
        }

        const hashPassword = await bcrypt.hash(password,10)
        await userExist.update({
            password:hashPassword
        },{transaction})
        
        await transaction.commit();
        return res.status(201).json({
            message:'Login Success',
            data: {
                user : userExist
            },
        })

       
    } catch (error) {
        await transaction.rollback();
        next(error)
    }
}


module.exports = {
    register, login, UpdatePassword
}