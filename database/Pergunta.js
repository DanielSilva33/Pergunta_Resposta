const Sequelize = require("sequelize"); //conectando com o sequelize
const connection = require("./database"); // solicitando conexão com o banco

//criando tabelas dentro do nosso banco
const pergunta = connection.define('perguntas', {
   titulo: {
       type: Sequelize.STRING,
       allowNull: false
   },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
   }  
});

//sincronizando as tabelas do banco com a do nosso sistema
pergunta.sync({force: false}).then(() =>{
    console.log("table created!");
});

module.exports = pergunta;