
let main_board = (req,res)=>{

    res.render('./board/main_board.html');
}

let write = (req,res)=>{
    res.render('./board/write.html')
}

let view = (req,res)=>{
    
    res.render('./board/view.html')
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

