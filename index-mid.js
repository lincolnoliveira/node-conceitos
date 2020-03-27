const express = require('express');

const server = express();

server.use(express.json()); // para poder entender o body em formato json

// CRUD usando um vetor
const users = ['dunga', 'zangado', 'soneca']

// criando um middleware geral, 
// vai interceptar todas as rotas (métodos + urls)
// e encaminhar
server.use((req, res, next) => {
    // ex: um middleware de log, que loga o método, a url e o tempo de execução
    console.time('MiddlewareLog');
    console.log(`Método: ${req.method}; URL: ${req.url}`);

    next();

    console.timeEnd('MiddlewareLog');
})

// função de middleware local
// precisa ser especificada na criação da rota para ser usada
function checkNameExists(req, res, next) {
    if (!req.body.name) {
        return res.status(400).json({ error: "Nome do usuário é obrigatório" })
    }

    return next();
}

function checkUserExists(req, res, next) {
    const userId = users[req.params.index];
    if (!userId) {
        return res.status(400).json({ error: "Índice de usuário não existe" })
    }

    // criando uma variável adicional dentro da requisição!
    // poderá ser acessada pelas funções que forem chamadas 
    req.user = userId;

    return next();
}
// Consulta um usuário
// localhost:3000/users/2
// notar que especificou uma função de middleware, será chamada antes da função anônima
server.get('/users/:index', checkUserExists, (req, res) => {
    // usando a variável criada na função/middleware 
    return res.json(req.user);
})

// Consulta todos os usuários
server.get("/users", (req, res) => {
    return res.json(users);
})

// Criação de usuário POST
server.post("/users", checkNameExists, (req, res) => {
    const { name } = req.body;
    users.push(name);
    return res.json(users);
})

// Alteração de usuário PUT
// podem ser especificadas quantas funções quiser como middleware
// Aliás, a última função, que é anônima, poderia ser uma função nomeada, então é apenas
// um encadeamento de funções
server.put('/users/:index', checkUserExists, checkNameExists, (req, res) => {
    const { index } = req.params;
    const { name } = req.body;
    users[index] = name;
    return res.json(users);
})

// Remoção de usuário DELETE
server.delete("/users/:index", checkUserExists, (req, res) => {
    const { index } = req.params;
    users.splice(index, 1);
    return res.json({ "mensagem": "Usuário removido" });
})

server.listen(3000);