const express = require('express');

const server = express();

server.use(express.json());
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
    // const id = req.params.id;
    const { id } = req.params; // igual acima, usando desestruturação
    return res.json({'userId': `usuário ${id}`}) // note a crase e ñ apóstrofo, p/ usar o template string
})

// CRUD usando um vetor

// Consulta um usuário
// localhost:3000/users/2
const users = ['dunga', 'zangado', 'soneca']
server.get('/users/:index', (req, res) => {
    const { index } = req.params;
    if (users[index])
        return res.json(users[index]);
    else
        return res.json({"mensagem": "Usuário não encontrado"});
})

// Consulta todos os usuários
server.get("/users", (req, res) => {
    return res.json(users);
})

// Criação de usuário POST
server.post("/users", (req, res) => {
    const { name } = req.body;
    users.push(name);
    return res.json(users);
})

// Alteração de usuário PUT
server.put('/users/:index', (req, res) => {
    const { index } = req.params;
    if (users[index]) {
        const { name } = req.body;
        users[index] = name; 
        return res.json(users);
    } else
        return res.json({"mensagem": "Usuário não encontrado"});
})

// Remoção de usuário DELETE
server.delete("/users/:index", (req,res) => {
    const { index } = req.params;
    if (users[index]) {
        users.splice(index, 1);
        return res.json({"mensagem" : "Usuário removido"});
    } else
        return res.json({"mensagem": "Usuário não encontrado"});
})

server.listen(3000);