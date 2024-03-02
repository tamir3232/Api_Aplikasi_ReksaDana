const { MutualFunds } = require("../database/models");


const getMutualFunds = async(req,res, next)=>{
    try {
        const MutualFundsExist = await MutualFunds.findAll()
        if(MutualFundsExist){
            return res.status(200).json({
                message:'Success get Mutual Funds',
                data:MutualFundsExist
            })
        }
        else{
            throw{
                code:404,
                message:'Mutual Funds Not Exist'
            }
        }

    } catch (error) {
        next(error)
    }
}



const postMutualFunds = async(req,res, next)=>{
    const{
        name, company, nav
    } = req.body
    try {
        const createMF = await MutualFunds.create({
            name:name,
            company:company,
            nav:nav
        })

        return res.status(201).json({
            message:'Success Add Mutual Funds',
            data:createMF
        })


    } catch (error) {
        next(error)
    }
}

const updateMutualFunds = async (req, res, next) => {
    try {
        const id = req.params.id
        const MutualFundsExist = await MutualFunds.findByPk(id)
        if (!MutualFundsExist) {
            throw {
                code: 404,
                message: 'Mutual Funds not found',
            }
        }

        await MutualFundsExist.update(req.body)

        return res.status(200).json({
            message: 'Update Mutual Funds successful',
            data: MutualFundsExist,
        })
    } catch (error) {
        next(error)
    }
}

const deleteMutualFunds = async (req, res, next) => {
    try {
        const id = req.params.id
        const MutualFundsExist = await MutualFunds.findByPk(id)
        if (!MutualFundsExist) {
            throw {
                code: 404,
                message: 'Mutual Funds not found',
            }
        }
        await MutualFundsExist.destroy( {force: true})

        return res.status(200).json({
            message: 'Delete Mutual Funds successful',
            data: MutualFundsExist,
        })
    } catch (error) {
        next(error)
    }
}


module.exports = {getMutualFunds,postMutualFunds, updateMutualFunds, deleteMutualFunds}

