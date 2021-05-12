let login = (req,res)=>{
    res.render('index.html');
}

let join = (req,res)=>{
    res.render('./user/join.html');
}

let join_success = (req,res)=>{
    res.render('./user/join_success.html');
}

let info = (req,res)=>{
    res.render('./user/info.html');
}


module.exports={
    login, join, join_success, info
}; 

