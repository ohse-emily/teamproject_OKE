const {Board,User,Comment} = require('../../models')

let main_board = async (req,res)=>{
    let userid = req.query.userid;
    
    let result = await Board.findAll({})

    res.render('./board/main_board.html',{
        userid, result,
    });

}

let write = (req,res)=>{
    
    res.render('./board/write.html',{
    })
}

let view_after_write = async (req,res)=>{
    let userid = req.session.uid;
    let subject = req.body.write_subject;
    let content = req.body.write_content;

    let result = await Board.create({
        userid,
        subject, 
        content,
    })

    res.render('./board/view.html',{
        userid, subject, content,
        id:result.id,
    })
}

let view = async (req,res)=>{
    let id = req.query.id;
    let result = await Board.findOne({
        where:{id}
    })

    req.session.id=id;
    req.session.save(()=>{
        res.render('./board/view.html',{
            userid:result.userid,
            subject:result.subject,
            content:result.content,
            id:result.id,
        })
    })

}



let modify = async (req,res)=>{
    let id = req.query.id;
    let result = await Board.findOne({
        where:{id}
    })
    res.render('./board/modify.html',{
        result,
    })
}

let view_after_modify = async (req,res)=>{
    let id = req.query.id;
    let subject = req.body.modify_subject;
    let content = req.body.modify_content;

    await Board.update({
        subject,content,
    },{
        where:{id}
    })

    let result = await Board.findOne({
        where:{id}
    })
    
    res.render('./board/view.html',{
        id:result.id,
        userid: result.userid,
        subject: result.subject,
        content: result.content,
    })
}


let remove = (req,res)=>{
    let id = req.query.id;
    Board.destroy({
        where: {id}
    })

    res.redirect('/board/main_board')
}

let comment_post=async(req,res,next)=>{ 
    let body = req.body; 

    console.log(body);
    let user = await User.findOne({
      attributes: ['id'],
      where: {
        userid:req.session.uid,
      }
    });
    let useridx = user.dataValues.id; 
    
    await Comment.create({
      board_id:body.boardid, 
      useridx: useridx,
      content: body.content,
      comment_type:true, 
    });
  
    
    let commList = await Comment.findAll({
      where:{
        board_id:body.boardid, 
      },
      order:[['id','DESC']],
    });
  
    res.json({
      commList,
    })
  }

module.exports={
  comment_post,
    main_board, write, view, modify, remove, view_after_write,view_after_modify,
}

