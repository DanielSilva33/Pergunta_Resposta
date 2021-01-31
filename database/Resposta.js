const Sequelize = require("sequelize"); //conectando com o sequelize
const connection = require("./database"); // solicitando conexão com o banco

const Resposta = connection.define("respostas", {
    corpo: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    perguntaId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Resposta.sync({force: false});

module.exports = Resposta;