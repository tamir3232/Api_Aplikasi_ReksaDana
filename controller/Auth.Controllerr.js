require('dotenv').config()

const { Users, sequelize } = require('../database/models');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const register = async(req,res,next)=>{
    let transactions
    try {
        
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
        transactions = await sequelize.transaction();
        const user = await Users.create(
            {
                name,
                email,
                password: hashPassword,
                role:"MEMBER"
            },
            { transactions }
        )


        await transactions.commit();
        return res.status(201).json({
            message:'User registration has successful',
            data: user,
        })

       
    } catch (error) {
        console.log("halo")
        await transactions.rollback();
        next(error)
    }
}




const login = async(req,res,next)=>{

    try {
        
        const{
            email,password
        } = req.body
        
        const userExist = await Users.findOne({
            where:{
                email:email,
                
            }
        })
        if(!userExist){
            return res.status(404).json({
                message : 'User not exist'
            })
        }

        const isPasswordValid = await bcrypt.compare(password, userExist.password)

        if(!isPasswordValid){
            return res.status(404).json({
                message: 'Password not valid',
            })
        }
        
        const token = jwt.sign(
            { email: userExist.email, id: userExist.id, role: userExist.role },
            process.env.JWT_SECRET)
      

        
      
        return res.status(200).json({
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
        transaction = await sequelize.transaction();
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