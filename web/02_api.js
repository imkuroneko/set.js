/* === Dependencias ============================================================================================================== */
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const SQLite = require('better-sqlite3');

/* === Endpoints Interacción ===================================================================================================== */
router.get('/api/:data', (req, res) => {
    try {
        const value = req.params.data;

        if(value.length == 0) {
            return res.set('Connection', 'close').json({ requestId: uuidv4(), status: false, message: "Por favor escriba el dato a buscar" });
        }

        if (!(/^[a-zA-Z0-9- .]+$/).test(value)) {
            return res.set('Connection', 'close').json({ requestId: uuidv4(), status: false, message: "El dato buscado tiene caracteres no permitidos; solo se permiten letras, números, puntos, guiones y espacios" });
        }

        const sql = new SQLite(path.resolve('./data/ruc.sqlite'), { readonly: true });

        const query = sql.prepare(" SELECT * FROM contribuyentes WHERE ruc_actual LIKE '%' || :ruc || '%' OR razon_social LIKE '%' || :rs || '%'; ");
        const get = query.all({ ruc: value, rs: value });
        sql.close();

        if(get.length == 0) {
            return res.set('Connection', 'close').json({ requestId: uuidv4(), status: false, message: "No se encontraron coincidencias para la búsqueda realizada" });
        }

        return res.set('Connection', 'close').json({ requestId: uuidv4(), status: true, message: "Data Ok", data: get });
    } catch (error) {
        console.error('[backend:getdata]', error.message);
        return res.set('Connection', 'close').json({ requestId: uuidv4(), status: false, message: "Se ha presentado un inconveniente al recuperar los datos, pero ya ha sido reportado para buscar una solución en la brevedad" });
    }
});

module.exports = router;