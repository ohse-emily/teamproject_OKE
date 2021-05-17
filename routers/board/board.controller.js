const { Board, User, Comment } = require('../../models')

// M A I N B O A R D   ㅁ  ㅔ  인 // 

let main_board = async (req, res) => {
    let userid = req.session.uid; //비회원 : undefined // 회원: userid 
    let flag = req.query.flag;   // 비회원only
    let login_flag = req.query.login_flag; //비회원only
    let result = await Board.findAll({
        order: [['id', 'DESC']]
    })
    //let board_length = result.length;  // numbering 
    let index = result.length;
    result.forEach((ele) => {
        if (index > 0) {
            ele.dataValues.numbering = index;
        }
        index--;
    })

    res.render('./board/main_board.html', {
        result, login_flag, userid, flag,
    });
}

//      글   쓰   기    WRITE  //

let write = (req, res) => {
    let userid = req.session.uid;

    if (userid == undefined) {
        res.redirect('/board/main_board?login_flag=0&flag=0')
    } else {
        res.render('./board/write.html', {
            userid
        })
    }
}

//     write 후  쓴 글 보기 V I E W   //

let view_after_write = async (req, res) => {
    let userid = req.session.uid;
    let subject = req.body.write_subject;
    let content = req.body.write_content;
    let hit = 0;
    console.log(userid, subject, content,)
    let result = await Board.create({
        userid,
        subject,
        content,
    })

    res.render('./board/view.html', {
        userid, subject, content,
        id: result.id,
        visiter: userid,  //visiter에 로그인한 본인 넣기 
        hit,
    })
}

//       V I E  W       ////

let view = async (req, res) => {
    let id = req.query.id;  //ok
    let visiter = req.query.visiter; // 로그인한 아이디 ( ≠ 글쓴이) //비회원 = undefined
    let hit_count = await Board.findOne({
        where: { id }
    })
    await Board.update({
        hit: hit_count.hit + 1,
    }, { where: { id } })

    let result = await Board.findOne({
        where: { id }
    })

    res.render('./board/view.html', {
        userid: result.userid,
        subject: result.subject,
        content: result.content,
        id: result.id,
        hit: result.hit,
        visiter,
    })
}

//       수    정      //// 

let modify = async (req, res) => {
    let id = req.query.id;
    let hit = req.query.hit;
    let result = await Board.findOne({
        where: { id }
    })
    res.render('./board/modify.html', {
        result, hit,
    })
}


//     수정   이후   view   //

let view_after_modify = async (req, res) => {
    let id = req.body.id;
    let subject = req.body.modify_subject;
    let content = req.body.modify_content;
    let hit = req.body.hit;
    let visiter = req.session.uid;

    await Board.update({
        subject, content,
    }, {
        where: { id }
    })  //여기서 조회수 -1을 해ㅑㅇ하나.. 

    let result = await Board.findOne({
        where: { id }
    })

    res.render('./board/view.html', {
        id: result.id,
        userid: result.userid,
        subject: result.subject,
        content: result.content,
        hit,
        visiter,
    })
}

//    삭   제     // 

let remove = (req, res) => {
    let id = req.query.id;
    Board.destroy({
        where: { id }
    })

    res.redirect('/board/main_board')
}



//     댓   글  Comment   //

let comment_post = async (req, res, next) => {
    let body = req.body;

    if (body.content !== undefined) {
        let user = await User.findOne({
            attributes: ['id'],
            where: {               //userid (로그인한) 사람이 쓴 글의 id 값을 
                userid: req.session.uid,
            }
        });
        let useridx = user.dataValues.id;  //useridx에 넣는다.

        await Comment.create({

            board_id: body.boardid,
            useridx: useridx,
            content: body.content,
        });
    }

    let commList = await Comment.findAll({
        include: [
            { model: User, }
        ],

        where: {
            board_id: body.boardid,
            master_comment: 0,
        },
        order: [['id', 'DESC']],
    });

    res.json({
        commList,
    })
}

//     답   글  Reply   //
let reply_post = async (req, res) => {
    let body = req.body;
    if (body.content !== undefined) {
        let user = await User.findOne({
            attributes: ['id'],
            where: {
                userid: req.session.uid,
            }
        });
        let useridx = user.dataValues.id;
        if (body.comment_id !== undefined) {
            body.content = '@' + body.comment_id + '  ' + body.content;
        }

        await Comment.create({
            board_id: body.boardid,
            useridx: useridx,
            content: body.content,
            master_comment: body.master_comment,

        });

        let replycount = await Comment.findOne({
            attributes: ['reply_count'],
            where: {
                id: body.master_comment,
            }
        });

        let replyCount = replycount.dataValues.reply_count + 1;

        await Comment.update({
            reply_count: replyCount,
        }, {
            where: {
                id: body.master_comment,
            }
        });
    }

    let replyList = await Comment.findAll({
        include: [
            { model: User, }
        ],

        where: {
            board_id: body.boardid,
            master_comment: body.master_comment,
        },
        // order: [['id', 'DESC']],
    });

    res.json({
        replyList,
    })

}

let check_commentid = async (req, res) => {
    let commenterid = await Comment.findOne({
        attributes: ['useridx'],
        where: {
            id: req.body.commentid,
        }
    });

    let comment_idx = commenterid.dataValues.useridx;

    let user = await User.findOne({
        attributes: ['id'],
        where: {
            userid: req.session.uid,
        }
    });

    let useridx = user.dataValues.id;

    if (comment_idx == useridx) {
        res.json({
            result: true,
        })
    } else {
        res.json({
            result: false,
        })
    }
}

let delete_comment = async (req, res) => {
    let isMaster = await Comment.findOne({
        attributes: ['master_comment', 'content'],
        where: {
            id: req.body.commentid,
        }

    })

    let result = await Comment.update({
        content: "삭제된 댓글입니다.",
    }, {
        where: {
            id: req.body.commentid,
        }
    });

    res.json({ isMaster, result });

}

let update_comment = async (req, res) => {
    await Comment.update({
        content: req.body.content,
    }, {
        where: {
            id: req.body.comment_id,
        }
    });

    let updatedOne = await Comment.findOne({
        attributes: ['content'],
        where: {
            id: req.body.comment_id,
        }
    })

    res.json({ updatedOne, });
}

module.exports = {
    comment_post, reply_post, check_commentid, delete_comment, update_comment,
    main_board, write, view, modify, remove, view_after_write, view_after_modify,
}

