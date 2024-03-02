const { Transactions, MutualFunds, MyInvest, sequelize } = require("../database/models");
const QRCode = require('qrcode'); 
const Jimp = require("jimp");
const fs = require('fs')
const qrCodeReader = require('qrcode-reader');
const { resolve } = require("path");
const { rejects } = require("assert");
const { Sequelize } = require("sequelize");

const getAllTransactions = async(req,res,next)=>{
    
    const transactionExist = await Transactions.findAll({
        where:{
            user_id:req.id
        }
        
    })
    


    return res.status(200).json({
        message:'My Transaction',
        data :transactionExist
        })


}

const getDetailTransactions = async(req,res,next)=>{
    
    const transactionExist = await Transactions.findAll({
        where:{
            user_id:req.id,
            id:req.params.id
        }
        
    })

    if(transactionExist.length<1){
        return res.status(404).json({
            message:'Transaction Not Exist',
            })
    }


    return res.status(200).json({
        message:'My Transaction',
        data :transactionExist
        })


}





const buy = async(req,res,next)=>{
    let transaction
    try {
        transaction = await sequelize.transaction();
        const MutualFundsExist = await MutualFunds.findOne({
            where:{
                id : req.body.mutualfund_id,
            }
        })
        if(!MutualFundsExist){
            throw {
                code: 404,
                message: 'Mutual Funds not found',
            }
        }

        if(req.body.totalamount < MutualFundsExist.nav){
            throw {
                code: 403,
                message: 'Minimum purchase Rp'+MutualFundsExist.nav,
            }
        }
        
        const buyMutualFunds = await Transactions.create({
            user_id : req.id,
            mutualfund_id : MutualFundsExist.id,
            transaction_type : 'buy',
            transaction_amount: req.body.totalamount,
            payment_method : req.body.payment_method,
            transaction_time: new Date,
            executed: false,
        },{transaction})


        QRCode.toFile(`./storage/${new Date().getTime()+'-'+buyMutualFunds.user_id}.png`, buyMutualFunds.id, {
        errorCorrectionLevel: 'H'
        }, function(error) {
        if (error) throw error;
        console.log('QR code saved!');
        });
        await transaction.commit();
        return res.status(200).json({
            message:'Transaction Created'
            })
        
    } catch (error) {
        await transaction.rollback();
        next(error)
    }
}

const pay = async  (req,res,next)=>{
    let transaction
    try {
        transaction = await sequelize.transaction();
     
        let filename = req.file.filename
        let transaction_id;
        const now = new Date()
        let checkedMyInvest
        const day = now.getDay();
        const hour = now.getHours()
        const minutes = now.getMinutes()
        const buffer = fs.readFileSync(`./public/images/uploads/${ filename }`);

        
        
        let pay;
        const qrReader = await new Promise((resolve, reject) => {
            Jimp.read(buffer, function(err, image) {
                if (err) {
                    console.error(err);
                    reject(err);
                }

                const qrCodeInstance = new qrCodeReader();

                qrCodeInstance.callback = function(err, value) {
                    if (err) {
                        console.error(err);
                        reject(err);
                    }
                    transaction_id = value.result;
                    resolve();
                };
                qrCodeInstance.decode(image.bitmap);
            });
        });

        const transactionExist = await Transactions.findOne({
            where:{
            id: transaction_id,
            user_id : req.id,
            paid:false}
        })


        if(!transactionExist){
            throw{
                code:404,
                message:"Transaction Not Found"
            }
        }
        if(req.body.amount < transactionExist.transaction_amount){
            throw{
                code:404,
                message:"The amount entered does not match the amount that should be"
            }
        }
        const nav = await MutualFunds.findByPk(transactionExist.mutualfund_id)
      
        if (((day >= 1 && day <= 5) && (hour === 8 && minutes >= 0) || (hour > 8 && hour < 15) || (hour === 15 && minutes === 0) )) {
           
            pay = await transactionExist.update({
                paid : true,
                executed:true
            },{transaction})
           
            checkedMyInvest = await MyInvest.findOne({
                mutualfund_id : pay.mutualfund_id
            })
            if(!checkedMyInvest){
               let totalUnit = pay.transaction_amount  / nav.nav
                checkedMyInvest = await MyInvest.create({
                    user_id : req.id,
                    mutualfund_id: pay.mutualfund_id,
                    units : totalUnit
                },{transaction})
            }
            else{
                await checkedMyInvest.update({
                    units : checkedMyInvest.units + (pay.transaction_amount  / nav.nav)
                },{transaction})
            }

        }

        else{
            pay = await transactionExist.update({
                paid : true,
                executed:false
            })
        }
        await transaction.commit();
        return res.status(200).json({
            message:'Pay Success',
            data :{
                transaction: pay, 
                myinvest: checkedMyInvest
            }
            })
    } catch (error) {
        await transaction.rollback();
        next(error)
    }
}


const sell = async (req,res,next)=>{
    let transaction
    try {
        transaction = await sequelize.transaction();
        const now = new Date()
        const day = now.getDay()
        const hour = now.getHours()
        const minutes = now.getMinutes()
        let paid = false
        let executed = false
        let myInvestExist = await MyInvest.findOne({
            where:{
                id:req.params.id,
                user_id:req.id
            }
        });

        if(!myInvestExist){
            throw{
                code:404,
                message: 'My invest not exist'
            }
        }

        let mutualFund = await MutualFunds.findByPk(myInvestExist.mutualfund_id)
        let myInvestExistAmount = (myInvestExist.units * mutualFund.nav) - myInvestExist.pendingswitch_amount - myInvestExist.pendingsell_amount
        let totalAmount =  req.body.amount

        if(totalAmount > myInvestExistAmount){
            throw{
                code:404,
                message: 'total Amount is to bigger'
            }
        }
       

        if (((day >= 1 && day <= 5) && (hour === 8 && minutes >= 0) || (hour > 8 && hour < 15) || (hour === 15 && minutes === 0) )) {
            paid = true
            executed = true
            await myInvestExist.update({
                units : (myInvestExistAmount / mutualFund.nav) - (totalAmount / mutualFund.nav)
            },{transaction})
        }
        else{
            await myInvestExist.update({
                pendingsell_amount : Number(myInvestExist.pendingsell_amount) + Number(totalAmount)
            },{transaction})
        }
        
        let createTransaction = await Transactions.create({
            user_id : req.id,
            mutualfund_id : myInvestExist.mutualfund_id,
            transaction_type : 'sell',
            transaction_amount: totalAmount,
            payment_method : req.body.payment_method,
            transaction_time: new Date,
            executed: executed,
            paid : paid,
        },{transaction})

        await transaction.commit();
        return res.status(200).json({
            message:'Sell Success',
            data : {
                transaction : createTransaction, 
                myinvest  : myInvestExist
            }
        })
    } catch (error) {
        await transaction.rollback();
        next(error)
    }
}


const switchMutualFund = async (req,res,next)=>{
    let transaction
    try {
        transaction = await sequelize.transaction();
        const now = new Date()
        const day = now.getDay()
        const hour = now.getHours()
        const minutes = now.getMinutes()
        let executed = false
        let targetMyInvest={}
        let myInvestExist = await MyInvest.findOne({
            where:{
                id:req.params.id,
                user_id:req.id
            }
        });
        
        if(!myInvestExist){
            throw{
                code:404,
                message: 'My invest not exist'
            }
        }

        let mutualFund = await MutualFunds.findByPk(myInvestExist.mutualfund_id)
        let targetMutualFund = await MutualFunds.findByPk(req.body.targetmutualfund_id)
        let myInvestExistAmount = (myInvestExist.units * mutualFund.nav) - myInvestExist.pendingswitch_amount - myInvestExist.pendingsell_amount
        if(!targetMutualFund){
            throw{
                code:404,
                message : 'the target mutual funds entered is not appropriate'
            }
        }

        let totalAmountMyinvest = myInvestExist.units * mutualFund.nav
        if(mutualFund.id == targetMutualFund.id || req.body.amount > myInvestExistAmount || req.body.amount < targetMutualFund.nav ){
            console.log(mutualFund.id == targetMutualFund.id)
            throw{
                code:404,
                message : 'the Amount entered is not appropriate or to the Amount entered bigger than exist'
            }
        }


        let targetunits = req.body.amount / targetMutualFund.nav
        
       
        if (((day >= 1 && day <= 5) && (hour === 8 && minutes >= 0) || (hour > 8 && hour < 15) || (hour === 15 && minutes === 0) )) {
            executed = true
        }

        let createTransaction = await Transactions.create({
            user_id : req.id,
            mutualfund_id : myInvestExist.mutualfund_id,
            transaction_type : 'switch',
            transaction_amount: req.body.amount ,
            transaction_time: new Date,
            executed: executed,
            switch_to : req.body.targetmutualfund_id
        })

        if(executed == true){
            await myInvestExist.update({
                units : myInvestExist.units - (req.body.amount / mutualFund.nav)
            },{transaction})
        
            targetMyInvest = await MyInvest.findOne({
                where:{
                    mutualfund_id:targetMutualFund.id
            }},{transaction})

            if(!targetMyInvest){
                targetMyInvest = await MyInvest.create({
                    user_id : req.id,
                    mutualfund_id: targetMutualFund.id,
                    units : targetunits
                },{transaction})
            }
            else {
                await targetMyInvest.update({
                    units : Number(targetMyInvest.units) + targetunits
                },{transaction})
            }
        }
        else{
            await myInvestExist.update({
                pendingswitch_amount : Number(myInvestExist.pendingswitch_amount) + Number(req.body.amount)
            },{transaction})
        }

       
        
       

        await transaction.commit();

        return res.status(200).json({
            message:'Switch Success',
            data : {
                transaction : createTransaction, 
                myinvest  : myInvestExist ,
                newmyinvest:targetMyInvest 
            }
        })




    } catch (error) {
        await transaction.rollback();
        next(error)
    }
}





module.exports = {buy, pay,sell, switchMutualFund, getAllTransactions,getDetailTransactions}