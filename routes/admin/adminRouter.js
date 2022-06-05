var express = require('express');
var router = express.Router();
var userRouter = require('./userRouter');
var newsRouter = require('./newsRouter')
var doctorsRouter = require('./doctorsRouter')
var patientsRouter = require('./patientsRouter')

//判断是否符合条件进入后台中间件
function permisson(req,res,next){
    if(req.session.username==undefined){
        //尚未登陆，返回至登录页
        res.render('info/info',{
            title:"尚未登陆",
            content:"请重新登陆,即将进入登陆页",
            href:"/rl/login",
            hrefTxt:"登录页"
        })
    }else{
        //正常进入
        next()
    }
}



/* GET users listing. */
router.get('/', permisson,function(req, res, next) {
    //console.log(req.session)
    res.render('admin/index',{username:req.session.username})
});

//后台用户管理模块
router.use('/users',userRouter)
//后台新闻管理
router.use("/news",newsRouter)
//后台医生管理
router.use("/doctors",doctorsRouter)
//后台患者管理
router.use("/patients",patientsRouter)

module.exports = router;
