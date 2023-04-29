/* === Dependencias ============================================================================================================== */
const express = require('express');
const router = express.Router();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/* ===== Cargar parámetros ======================================================================================================= */
const website = require(path.resolve('./config/website.json'));

/* === Endpoints Interacción ===================================================================================================== */
router.get('/assets/*', (req, res) => {
    return res.status(404).send('Not found');
});

module.exports = router;