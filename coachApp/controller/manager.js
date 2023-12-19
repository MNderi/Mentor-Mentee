
const Manager= require('../model/managerModel')
const Identity= require('../model/identityModel');
const Program= require('../model/programModel')
const connectDB=require('../model/db')

exports.login=function(req,res){
  res.render('managerLogin');
}
exports.handleManagerLogin= function(req,res){
    const {mail, password }= req.body;
    console.log(mail ,password)
        
    res.redirect('/dashboard/mentees')    
     
}