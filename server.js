const express = require('express');

const morgan = require('morgan');
const helmet = require('helmet');

const projectsRouter = require('./projects/projectsRouter');
const actionsRouter = require('./actions/actionsRouter');

const server = express();

server.use(express.json());
server.use(morgan('dev'));
server.use(helmet());
server.use('/api/projects', projectsRouter);
server.use('/api/actions', actionsRouter);

server.get('/', (req, res) => {
  res.send(`
    <h1>Activate interlock!</h1>
    <h1>Dynotherms connected!</h1>
    <h1>Infracells up!</h1>
    <h1>Megathrusters are go!</h1>
    `);
});

module.exports = server;
