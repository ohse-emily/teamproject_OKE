const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            userid:{
                type:Sequelize.STRING(30),
                allowNull:false,
                unique:true,
            },
            userpw:{
                type:Sequelize.STRING(30),
                allowNull:false,
            },
            username:{
                type:Sequelize.STRING(30),
                allowNull:false,
            },
            userimage:{
                type:Sequelize.STRING(100),
                allowNull:true,
            },
            mobile:{
                type:Sequelize.STRING(20),
                allowNull:false,
            },
            useremail:{
                type:Sequelize.STRING(100),
                allowNull:false,
            },
            userdt:{
                type:Sequelize.DATEONLY,
                allowNull:false,
                defaultValue:Sequelize.NOW,
                get:function(){
                    return moment(this.getDataValue('userdt')).format('HH:mm YYYY-MM-DD')
                }
            }
        },{
            sequelize,
            underscored:false,
            timestamps:false,
            paranoid:false,
            modelName:"User",
            tableName:"users",
            charset:"utf8mb4",
            collate:"utf8mb4_general_ci",
        })
    }
    static associate(db){}  //다른 테이블들과 join 가능 하게하는 코드 
}

