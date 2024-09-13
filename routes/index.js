const express = require('express');
const route = express.Router();

/* GET home page. */

const initApiRoutes = (app) => {
    route.get('/', (req, res) => {
        res.status(200);
        res.end("Project SDN GROUP 1")
    });

    return app.use('/api/v1', route);;
}

module.exports = initApiRoutes;
