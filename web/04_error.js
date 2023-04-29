/* === Dependencias ============================================================================================================== */
const express = require('express');
const router = express.Router();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/* ===== Cargar parámetros ======================================================================================================= */
const website = require(path.resolve('./config/website.json'));

/* === Endpoints Interacción ===================================================================================================== */
router.get('/*', (req, res) => {
    res.status(404).render('error', {
        web_title: `HTTP 404 Not Found | ${website.name}`,
        title: "HTTP 404 Not Found",
        message: "The address doesn't exist.",
        error_uid: uuidv4()
    });
});

module.exports = router;