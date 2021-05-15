const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = class Board extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            userid:{
                type:Sequelize.STRING(30),
                allowNull:false,
            },
            subject:{
                type:Sequelize.STRING(100),
                allowNull:false,
            },
            userimage:{
                type:Sequelize.STRING(100),
                allowNull:true,
            },
            content:{
                type:Sequelize.TEXT,
                allowNull:false,
            },
            like:{
                type:Sequelize.INTEGER(11),
                allowNull:false,
                defaultValue:'0'
            },
            hit:{
                type:Sequelize.INTEGER(11),
                allowNull:false,
                defaultValue:'0'
            },
            date:{
                type:Sequelize.DATEONLY,
                allowNull:false,
                defaultValue:Sequelize.NOW,
                get:function(){
                    return moment(this.getDataValue('date')).format('YYYY-MM-DD')
                }
            },

        },{
            sequelize,
            underscored:false,
            timestamps:false,
            paranoid:false,
            modelName:"Board",
            tableName:"board",
            charset:"utf8mb4",
            collate:"utf8mb4_general_ci",
        })
    }
    static associate(db){}  //다른 테이블들과 join 가능 하게하는 코드 
}

