/* === Dependencias ============================================================================================================== */
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const SQLite = require('better-sqlite3');
const multer = require('multer');

const upload = multer();


/* === Endpoints Interacción ===================================================================================================== */
router.post('/', upload.none(), async (req, res) => {
    try {
        if(!'dato' in req.body) {
            return res.set('Connection', 'close').json({ status: false, message: "No se ha recibido el dato a buscar" });
        }

        const value = req.body.dato;

        if(value.length == 0) {
            return res.set('Connection', 'close').json({ status: false, message: "Por favor escriba el dato a buscar" });
        }

        if (!(/^[a-zA-Z0-9- .]+$/).test(value)) {
            return res.set('Connection', 'close').json({ status: false, message: "El dato buscado tiene caracteres no permitidos; solo se permiten letras, números, puntos, guiones y espacios" });
        }

        const sql = new SQLite(path.resolve('./data/ruc.sqlite'), { readonly: true });

        const query = sql.prepare(" SELECT * FROM contribuyentes WHERE ruc_actual LIKE '%' || :ruc || '%' OR razon_social LIKE '%' || :rs || '%'; ");
        const get = query.all({ ruc: value, rs: value });
        sql.close();

        if(get.length == 0) {
            return res.set('Connection', 'close').json({ status: false, message: "No se encontraron coincidencias para la búsqueda realizada" });
        }

        var htmlContent = "<table class='table table-sm'>";
        htmlContent += "<thead><tr><th>RUC</th><th>Razón Social / Nombre y Apellido</th></tr></thead><tbody>";
        get.forEach((item) => {
            htmlContent += `<tr><td>${item.ruc_actual}-${item.digito_verificador}</td><td>${item.razon_social}</td></tr>`;
        });
        htmlContent += "</tbody></table>";

        return res.set('Connection', 'close').json({ status: true, message: "Data Ok", html: htmlContent });
    } catch (error) {
        console.error('[backend:getdata]', error.message);
        return res.set('Connection', 'close').json({ status: false, message: "Se ha presentado un inconveniente al recuperar los datos, pero ya ha sido reportado para buscar una solución en la brevedad" });
    }
});

module.exports = router;