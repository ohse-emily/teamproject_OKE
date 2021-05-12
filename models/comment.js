const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = class Comment extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            userid:{
                type:Sequelize.STRING(30),
                allowNull:false,
                unique:true,
            },
            userimage:{
                type:Sequelize.STRING(100),
                allowNull:true,
            },
            content:{
                type:Sequelize.TEXT,
                allowNull:false,
            },
            board_id:{
                type:Sequelize.INTEGER(11),
                allowNull:false,
            },
            date:{
                type:Sequelize.DATEONLY,
                allowNull:false,
                defaultValue:Sequelize.NOW,
                get:function(){
                    return moment(this.getDataValue('userdt')).format('YYYY-MM-DD')
                }
            },
            comment_type:{
                type:Sequelize.BOOLEAN,
                allowNull:false,   //그냥 댓글이면 true, 답글이면 false 
            },
            parents_comment:{
                type:Sequelize.INTEGER(11),
                allowNull:true,
            }
        },{
            sequelize,
            underscored:false,
            timestamps:false,
            paranoid:false,
            modelName:"Comment",
            tableName:"comment",
            charset:"utf8mb4",
            collate:"utf8mb4_general_ci",
        })
    }
    static associate(db){}  //다른 테이블들과 join 가능 하게하는 코드 
}

