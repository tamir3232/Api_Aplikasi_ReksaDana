const { MyInvest, MutualFunds } = require("../database/models");

const getMyInvest = async (req,res,next)=>{

    try {
        const myInvestExist = await MyInvest.findAll({
            where:{
                user_id:req.id
            }  
        })

        for(const investment of myInvestExist){

            const mutualFund = await MutualFunds.findByPk(investment.mutualfund_id)

            await investment.update({amount: mutualFund.nav * investment.units })
        }

        return res.status(200).json({
            message:'My Transaction',
            data :myInvestExist
            
            })
    } catch (error) {
        next(error)
    }
   
}


const getDetailMyInvest = async(req,res,next)=>{
    
    try {
        const myInvestExist = await MyInvest.findOne({
            where:{
                user_id:req.id,
                id:req.params.id
            }

        })

        const mutualFund = await MutualFunds.findByPk(myInvestExist.mutualfund_id)

        await myInvestExist.update({ammount:mutualFund.nav * myInvestExist.units})

        return res.status(200).json({
            message:'My Transaction',
            data :{
                id : myInvestExist.id,
                units: myInvestExist.units,
                name:mutualFund.name,
                ammount: myInvestExist.units * mutualFund.nav,
                nav:mutualFund.nav,
                pendingsell_amount: myInvestExist.pendingsell_amount,
                pendingswitch_amount: myInvestExist.pendingswitch_amount

            }
            })
    
    } catch (error) {
        next(error)
    }
}


module.exports= {
    getMyInvest,
    getDetailMyInvest
}