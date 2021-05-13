const {Board} = require('../../models')

let main_board = (req,res)=>{

    res.render('./board/main_board.html');
}

let write = (req,res)=>{
    res.render('./board/write.html')
}

let view = async (req,res)=>{
    let userid = req.query.userid
    let subject = req.body.write_subject;
    let content = req.body.write_content;
    console.log(userid,subject,content)
    await Board.create({
        userid, 
        subject, 
        content,
        like:
    })

    res.render('./board/view.html',{
        userid, subject, content,
    })
}

let modify = (req,res)=>{
    res.render('./board/modify.html')
}

let remove = (req,res)=>{
    res.redirect('/board/main_board')
}
module.exports={
    main_board, write, view, modify, remove, 
}

