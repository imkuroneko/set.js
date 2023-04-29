/* === Dependencias ============================================================================================================== */
const express = require('express');
const router = express.Router();
const path = require('path');

/* ===== Cargar parámetros ======================================================================================================= */
const website = require(path.resolve('./config/website.json'));

/* === Endpoints Interacción ===================================================================================================== */
router.get('/', (req, res) => {
    res.render('index', {
        title: website.name
    });
});

module.exports = router;