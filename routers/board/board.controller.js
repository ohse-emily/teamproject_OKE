const {Board,User,Comment} = require('../../models')

// M A I N B O A R D   ㅁ  ㅔ  인 // 

let main_board = async (req,res)=>{
    // let userid = req.session.uid; //비회원 : undefined // 회원: userid 
    let flag = req.query.flag;
    let login_flag=req.query.login_flag; //비회원only

    let result = await Board.findAll({
        order:[['id','DESC']]
    })

    let board_length = result.length;  // numbering 
    let index=board_length; //17
    result.forEach((ele)=>{
        if(index>0){
        ele.dataValues.numbering = index;}
        index--;
    })
    
    res.render('./board/main_board.html',{
        result, flag, login_flag,
    });
    console.log(result);
}

//      글   쓰   기    WRITE  //

let write = (req,res)=>{
    let userid = req.session.uid;
    console.log(userid);

    if(userid==undefined){
        res.redirect('/board/main_board?flag=0')
    }else {
    res.render('./board/write.html',{
    userid})
    }
}

//     write 후  쓴 글 보기 V I E W   //

let view_after_write = async (req,res)=>{
    let userid = req.session.uid;
    let subject = req.body.write_subject;
    let content = req.body.write_content;
    let hit=0;
    console.log(userid, subject, content, )
    let result = await Board.create({
        userid,
        subject, 
        content,
    })

    res.render('./board/view.html',{
        userid, subject, content,
        id:result.id,
        visiter:userid,  //visiter에 로그인한 본인 넣기 
        hit,
    })
}

//       V I E  W       ////

let view = async (req,res)=>{
    let id = req.query.id;  //ok
    let visiter = req.query.vister; //로그인한 아이디 ( ≠ 글쓴이) //비회원 = undefined
    let hit_count = await Board.findOne({
        where:{id}
    })

    await Board.update({
        hit:hit_count.hit+1,
    },{where:{id}})

    let result = await Board.findOne({
        where:{id}
    })

    res.render('./board/view.html',{
        userid:result.userid,
        subject:result.subject,
        content:result.content,
        id:result.id,
        visiter,  
        hit:result.hit,
    })
}

//       수    정      //// 

let modify = async (req,res)=>{
    let id = req.query.id;
    let hit=req.query.hit;
    let result = await Board.findOne({
        where:{id}
    })
    console.log(result)
    res.render('./board/modify.html',{
        result,hit,
    })
}


//     수정   이후   view   //

let view_after_modify = async (req,res)=>{
    let id = req.query.id;
    let subject = req.body.modify_subject;
    let content = req.body.modify_content;
    let hit = req.query.hit;

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
        hit,
    })
}

//    삭   제     // 

let remove = (req,res)=>{
    let id = req.query.id;
    Board.destroy({
        where: {id}
    })

    res.redirect('/board/main_board')
}



//     댓   글  Comment   //

let comment_post=async(req,res,next)=>{ 
    let body = req.body; 

    let user = await User.findOne({
      attributes: ['id'],
      where: {               //userid (로그인한) 사람이 쓴 글의 id 값을 
        userid:req.session.uid,
      }
    });
    console.log(user)
    let useridx = user.dataValues.id;  //useridx에 넣는다.
    
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

