const express = require('express');

const server = express();

// criando as rotas

// ao acessar localhost:3000/teste, execute a função
// se colocar os parâmetros da função, serão a requisição e a resposta
server.get('/teste', (req, res) => {
    //    return res.send('Olá teste!') // retornando texto plano
    return res.json({ 'mensagem': 'Olá teste!' }) //retornando um json

});

// acessando os dados da requisição
// query params -> ?nome=Zé
// route params -> /users/1
// request body -> { "nome":"Zé", "email":"ze@mane.com" }

// localhost:3000/query?nome=Alguem
server.get('/query', (req, res) => {
    const nome = req.query.nome;
    return res.json({'mensagem': `Olá ${nome}`}) // note a crase e ñ apóstrofo, p/ usar o template string
})
// localhost:3000/rota/200
server.get('/rota/:id', (req, res) => {
    const id = req.params.id;
    const { id } = req.params;
    return res.json({'userId': `usuário ${id}`}) // note a crase e ñ apóstrofo, p/ usar o template string
})

server.listen(3000);