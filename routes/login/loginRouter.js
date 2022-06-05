var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var sqlQuery = require('../../module/lcMysql');

function jiami(str){
    let salt = "fjdsoigijasoigjasdiodgjasdiogjoasid"
    let obj = crypto.createHash('md5')
    str = salt+str;
    obj.update(str)
    return obj.digest('hex')
}

/* GET users listing. */
router.get('/register', function(req, res, next) {
  res.render('login/register.ejs')
});
router.get('/login', function(req, res, next) {
    res.render('login/login.ejs')
});

router.post('/register',async (req,res)=>{
    //获取username和密码
    let username = req.body.username;
    let password = req.body.password;
    //判断用户是否存在,如果没有用户才进行插入
    let sqlStr = "select * from user where username = ?";
    let result = await sqlQuery(sqlStr,[username]);
    if(result.length!=0){
        //告知此用户名已存在，请直接登陆或者找寻密码
        res.render('info/info',{
            title:"注册失败",
            content:"用户已存在",
            href:"/rl/register",
            hrefTxt:"注册页"
        })
    }else{
        //告知注册成功
        sqlStr = "insert into user (username,password,roleid) values (?,?,1)"
        await sqlQuery(sqlStr,[username,jiami(password)])
        res.render('info/info',{
            title:"注册成功",
            content:"注册成功，即将进入登陆页",
            href:"/rl/login",
            hrefTxt:"登录页"
        })
    }
})



//处理登陆提交的post请求
router.post('/login',async (req,res)=>{
    //获取username和密码
    let username = req.body.username;
    let password = req.body.password;
    let sqlStr = "select * from user where username=? and password = ?";
    let result = await sqlQuery(sqlStr,[username,jiami(password)])
    if(result.length==0){
        //登陆失败
        res.render('info/info',{
            title:"登陆失败",
            content:"用户或密码错误",
            href:"/rl/login",
            hrefTxt:"登陆页"
        })
    }else{
        req.session.username = username;
        res.render('info/info',{
            title:"登陆成功",
            content:"立即跳转至后台页面",
            href:"/admin",
            hrefTxt:"后台"
        })
    }
})

//退出登陆
router.get('/loginout',(req,res)=>{
    req.session.destroy()
    res.render('info/info',{
        title:"退出登陆成功",
        content:"立即跳转登陆页面",
        href:"/rl/login",
        hrefTxt:"登陆"
    })
})


module.exports = router;
