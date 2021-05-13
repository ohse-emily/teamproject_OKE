
const { User } = require('../../models/index');

let join = (req, res) => {
    res.render('./user/join.html')
}

let login = (req, res) => {
    let flag = req.query.flag;
    res.render('./user/login.html',{ flag })
}

let info = async (req, res) => {
    let userid = req.query.userid;
    let userlist = await User.findOne({
        where : {userid}
    });
    
    res.render('./user/info.html',{
        userlist:userlist,
    })
}


let join_success = async (req, res) => {
    let userid = req.body.userid;
    let userpw = req.body.userpw;
    let username = req.body.username;
    let userimage = req.file == undefined ? '': req.file.file;
    let mobile = req.body.mobile;
    let useremail = req.body.useremail;

    let rst = await User.create({ 
        userid, userpw, username, userimage,mobile, useremail 
    })

    res.render('./user/join_success.html', { userid, username });
}

let login_check = async (req, res) => {
    let userid = req.body.userid;
    let userpw = req.body.userpw;

    let result = await User.findOne({
        where: { userid, userpw }
    })
    //로그인 실패했을떄
    if (result == null) {
        res.redirect('/user/login?flag=0')
    } else {//로그인 성공했을 떄

        req.session.uid = userid;
        req.session.isLogin = true;

        req.session.save(() => {
            res.redirect('/');
        })
    }
}


let logout = (req, res) => {
    delete req.session.isLogin;
    delete req.session.uid;

    req.session.save(() => {
        res.redirect('/');
    })
}


let userid_check = async (req,res)=>{
    let userid = req.query.userid;
    console.log(userid)
    let result = await User.findOne({
        where:{ userid }
    })
    let flag = false
    if(result == undefined){
        flag = true;
    }else{
        flag = false;
    }   

    res.json({
        login: flag,
        userid
    })
}
module.exports = {
    join: join,
    login: login,
    info: info,
    join_success: join_success,
    login_check: login_check,
    logout,
    userid_check: userid_check
}
