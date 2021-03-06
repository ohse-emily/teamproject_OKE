const { User } = require('../../models/index');
const moment = require('moment');

let join = (req, res) => {
    res.render('./user/join.html')
}

let login = (req, res) => {
    let flag = req.query.flag;
    res.render('./user/login.html',{flag,})
}

let info = async (req, res) => {
    let userid = req.session.uid; 
    let userlist = await User.findOne({
        where : {userid}
    });
    let short = userlist.dataValues;
    res.render('./user/info.html',{
        id:short.id,
        userid:short.userid,
        userpw:short.userpw,
        username:short.username,
        userimage:short.userimage,
        mobile:short.mobile,
        useremail:short.useremail,
        userdt:moment(short.userdt).format('YYYY년 MM월 DD일 hh:mm:ss a'),
    })
}


let join_success = async (req, res) => {
    let userid = req.body.userid;
    let userpw = req.body.userpw;
    let username = req.body.username;
    let userimage = req.file == undefined ? '../../images/user.jpg': req.file.filename;
    let mobile = req.body.mobile;
    let useremail = req.body.useremail;

    let rst = await User.create({ 
        userid, userpw, username, userimage,mobile, useremail 
    })

    res.render('./user/join_success.html', { userid, username, userimage });
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

        req.session.uid = userid;  //server에 login userid 저장 
        req.session.uid2 = userid;
        req.session.isLogin = true;
        req.session.userimage=result.userimage;

        req.session.save(() => {
            res.redirect(`/board/main_board`);
        })
    }
}


let logout = (req, res) => {
    delete req.session.isLogin;
    delete req.session.uid;
    delete req.session.uid2;
    delete req.session.userimage;

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


let info_modify = async (req,res)=>{
    let id = req.query.id;
    let result = await User.findOne({where:{id}})
    let short = result.dataValues;
    console.log(id,'++++++++++++',result)
    res.render('./user/info_modify.html',{
        id,
        userid:short.userid,
        userpw:short.userpw,
        username:short.username,
        userimage:short.userimage,
        mobile:short.mobile,
        useremail:short.useremail,
        userdt:short.userdt,
    })
}

let info_after_modify = async (req,res)=> { //DB 업데이트, findOne 해오기 
    let id= req.body.id;
    let userid = req.body.userid;
    let userpw = req.body.userpw;
    let username = req.body.username;
    let userimage = req.file == undefined ? '': req.file.filename;
    let mobile = req.body.mobile;
    let useremail = req.body.useremail;
    let userdt = req.body.userdt;


    console.log(id,userid,userpw,username,userimage,mobile,useremail,userdt)

    await User.update({
        userid,userpw,username,userimage,mobile,useremail,userdt,
    },{where:{id}});

    console.log(id,userid,userpw,username,userimage,mobile,useremail,userdt)

    let result = await User.findOne({
        where:{id,}
    })
    req.session.userimage=userimage;
    req.session.save(()=>{
        res.render('./user/info.html',{
            id:result.id,
            userid:result.userid,
            userpw:result.userpw,
            username:result.username,
            userimage:result.userimage,
            mobile:result.mobile,
            useremail:result.useremail,
    
        })
    })


}

let user_memo = (req,res)=>{
    let user_memo = req.body.sider_memo;
        
    req.session.user_memo=user_memo;
    req.session.save(() => {
        
    })

}

let heart = (req,res)=>{
    let n = Math.floor(Math.random()*5);
    res.render('./user/heart.html',{
        n,
    })
}

module.exports = {
    join,
    login,
    info,
    join_success,
    login_check,
    logout,
    userid_check,
    info_modify,
    info_after_modify,
    user_memo,heart,
}
