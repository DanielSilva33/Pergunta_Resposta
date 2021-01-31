const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const pergunta = require('./database/Pergunta');
const resposta = require('./database/Resposta');

//Conectando no banco e exibindo se ouve erro ou não
connection
    .authenticate()
    .then(() =>{
        console.log("Connections BD is running...")
    })
    .catch((err) =>{
        console.log("Error connection!" + err)
    });

//view engine utilizada ejs
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: false})); //enviando os dados para enviar com js
app.use(bodyParser.json());


app.get("/", (req, res) => {
    pergunta.findAll({ raw: true, order: [
        ['id', 'DESC'] //Ordenando a lista como decrescente com DESC, caso queira crescente ASC
    ] }).then(perguntas =>{// SELECT * FROM perguntas, para buscar todos os dados da tabela pergunta
        res.render("index", {
            perguntas: perguntas //pegando a resposta do BD e armazenando na var para utilizar no HTML
        });
    }); 
});

app.get("/perguntar", (req, res) => {
    res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() =>{
        res.redirect("/");
    });
});

//pegando a pergunta selecionada
app.get("/pergunta/:id", (req, res) =>{
    var id = req.params.id;
    pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined) { //pergunta encontrada

            resposta.findAll({
                order: [
                ['id', 'DESC'] 
            ],
                where: {perguntaId: pergunta.id} //buscando todas as respostas para essa pergunta no banco
            }).then(respostas =>{
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        }else { //pergunta não encontrada
            res.redirect("/")
        }
    });
});

app.post("/responder", (req, res) =>{
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId)
    });
});

app.listen(8080, () => {
    console.log("Server is running...")
});