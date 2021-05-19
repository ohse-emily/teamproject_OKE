const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = class Comment extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            //useridx userimage 삭제 
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            board_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
            },
            date: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            reply_count: {  //답글이 달리면 +1 
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 0,
            },
            master_comment: {  // 댓글이면 0, 답글이면 답글 주인의 id값. 
                type: Sequelize.INTEGER(11),
                allowNull: true,
                defaultValue: 0,
            }
        }, {
            sequelize,
            underscored: false,
            timestamps: false,
            paranoid: false,
            modelName: "Comment",
            tableName: "comment",
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci",
        })
    }
    static associate(db) { }  //다른 테이블들과 join 가능 하게하는 코드 
}

