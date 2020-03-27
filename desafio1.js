const express = require('express');

const server = express();

server.use(express.json()); // para poder entender o body em formato json

// CRUD usando um vetor
const projects = [{"id": 0, "title": "Projeto zero", "tasks": []},
                  {"id": 1, "title": "Projeto uno", "tasks": []}];
let reqNumber = 0;

// criando um middleware geral, 
// vai interceptar todas as rotas (métodos + urls)
// e encaminhar
server.use((req, res, next) => {
    // ex: um middleware de log, que loga o método, a url e o tempo de execução
    console.time('TempoDestaRequisicao');
    reqNumber++;
    console.log(`Método: ${req.method}; URL: ${req.url}; nº de requisições: ${reqNumber}`);

    next();

    console.timeEnd('TempoDestaRequisicao');
})

function checkId(req, res, next) {
    const id = req.params.id;
    if (!projects[id]) {
        return res.status(400).json({ error: "Projeto "+id+" não encontrado." })
    }

    return next();
}

// Consulta todos os projetos
server.get("/projects", (req, res) => {
    return res.json(projects);
})

// Criação de projeto POST
server.post("/projects", (req, res) => {
    const { id, title } = req.body;
    const newProject = {"id":id, "title":title, tasks:[]};
    projects.push(newProject);
    return res.json(projects);
})

// Criação de tarefas dentro de um projeto: POST
server.post("/projects/:id/tasks", checkId, (req, res) => {
    const { id } = req.params;
    const { task } = req.body;
    projects[id].tasks.push(task);
    return res.json(projects[id]);
})


// Consulta um projeto
// localhost:3000/projects/2
// notar que especificou uma função de middleware, será chamada antes da função anônima
server.get('/projects/:id', checkId, (req, res) => {
    const { id } = req.params;
    return res.json(projects[id]);
})

// Alteração de projeto PUT
// podem ser especificadas quantas funções quiser como middleware
// Aliás, a última função, que é anônima, poderia ser uma função nomeada, então é apenas
// um encadeamento de funções
server.put('/projects/:id', checkId, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    projects[id].title = title;
    return res.json(projects);
})

// Remoção de usuário DELETE
server.delete("/projects/:id", checkId, (req, res) => {
    const { id } = req.params;
    const old = projects[id].title;
    projects.splice(id, 1);
    return res.json({ "mensagem": "Projeto '"+old+"' removido" });
})

server.listen(3000);