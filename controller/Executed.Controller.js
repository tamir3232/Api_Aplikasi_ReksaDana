const { NUMBER } = require("sequelize");
const { Transactions, MutualFunds, MyInvest, sequelize } = require("../database/models");



const executed = async(req,res,next)=>{
    let transaction
    try {
        transaction = await sequelize.transaction();
        let transactionExist= await Transactions.findOne({
            where:{
                id : req.params.id,
                executed:false,
            }
        })

        if(!transactionExist){
            throw{
                code:400,
                message:"Transactions Is Not Exist"
            }
        }
        
        if(transactionExist.transaction_type == 'buy' ){
            if(transactionExist.paid == false){
                throw{
                    code:400,
                    message:"Transactions Not Paid"
                }
            }
         
            await transactionExist.update({
                executed : req.body.executed
            },{transaction})
        
            if(transactionExist.executed == true){
                return res.status(200).json({
                    message:'Transaction Is Not Executed',
                    data :{
                        transaction: transactionExist, 
                       
                    }
                    })
            }

           
            let myInvestExist = await MyInvest.findOne({
                where:{
                    mutualfund_id : transactionExist.mutualfund_id,
                    user_id : transactionExist.user_id
                }
            })
           
            let mutualFundExist = await MutualFunds.findByPk(transactionExist.mutualfund_id)
            let unitsExist = transactionExist.transaction_amount / mutualFundExist.nav
            
            if(!myInvestExist){
                myInvestExist  = await MyInvest.create({
                    user_id : transactionExist.user_id,
                    mutualfund_id: transactionExist.mutualfund_id,
                    units : unitsExist
                },{transaction})
            }
            else{
              
                await myInvestExist.update({
                    units :Number(myInvestExist.units) + Number(unitsExist)
                },{transaction})
               
            }
            await transaction.commit()
            return res.status(200).json({
                message:'Transaction Is Executed',
                data :{
                    transaction: transactionExist, 
                    myinvest : myInvestExist
                }
                })
        }
        else if(transactionExist.transaction_type == 'sell'){

            transactionExist = await transactionExist.update({
                executed : req.body.executed
            },{transaction})

            if(transactionExist.executed == false){
                return res.status(400).json({
                    message:'Transaction Is Not Executed',
                    data :{
                        transaction: transactionExist, 
                       
                    }
                    })
            }

            let myInvestExist = await MyInvest.findOne({
                where:{
                    mutualfund_id : transactionExist.mutualfund_id,
                    user_id : transactionExist.user_id
                }
            })

            
            if(!myInvestExist){
                throw{
                    code:400,
                    message:"My Invest Not Found"
                }
            }
            let mutualFundExist = await MutualFunds.findByPk(transactionExist.mutualfund_id)
            let transactionUnits = Number(transactionExist.transaction_amount) / Number(mutualFundExist.nav)

           

            await myInvestExist.update({
                pendingsell_amount : Number(myInvestExist.pendingsell_amount) - Number(transactionExist.transaction_amount),
                units :Number(myInvestExist.units) - transactionUnits
            },{transaction})
        
            
            await transaction.commit()
            return res.status(200).json({
                message:'Transaction Is Executed',
                data :{
                    transaction: transactionExist, 
                    myinvest : myInvestExist
                }
                })
        }
        else if(transactionExist.transaction_type == 'switch'){
            await transactionExist.update({
                executed : req.body.executed
            })

            if(transactionExist.executed == false){
                return res.status(200).json({
                    message:'Transaction Is Not Executed',
                    data :{
                        transaction: transactionExist, 
                       
                    }
                    })
            }

            let myInvestExist = await MyInvest.findOne({
                where:{
                    mutualfund_id : transactionExist.mutualfund_id,
                    user_id : transactionExist.user_id
                }
            })
            
            let mutualFund = await MutualFunds.findByPk(myInvestExist.mutualfund_id)
            let targetMutualFund = await MutualFunds.findByPk(transactionExist.switch_to)
            

            let transactionUnits = Number(transactionExist.transaction_amount) / Number(mutualFund.nav)
            let switchToUnits =     Number(transactionExist.transaction_amount)/Number(targetMutualFund.nav)
            await myInvestExist.update({
                    units : Number(myInvestExist.units) - transactionUnits,
                    pendingswitch_amount : Number(myInvestExist.pendingswitch_amount) - Number(transactionExist.transaction_amount)
             },{transaction})

            targetMyInvest = await MyInvest.findOne({
                where:{
                    mutualfund_id:targetMutualFund.id,
                    user_id : transactionExist.user_id
            }},{transaction})

            if(!targetMyInvest){
                targetMyInvest = await MyInvest.create({
                    user_id : transactionExist.user_id,
                    mutualfund_id: targetMutualFund.id,
                    units : switchToUnits
                },{transaction})
            }
            else {
                await targetMyInvest.update({
                    units : Number(targetMyInvest.units) + switchToUnits
                },{transaction})
            }

            await transaction.commit();
            return res.status(200).json({
                message:'Transaction Is Executed',
                data :{
                    transaction: transactionExist, 
                    myinvest : myInvestExist
                }
                })
        }
        else{
            await transaction.rollback();
            throw{
                code:400,
                message:"Transactin Not Exist"
            }
        }
        
    } catch (error) {
        await transaction.rollback()
        next(error)
    }
    


}

module.exports = executed