/* ===== Cargar módulos ================================================================================== */
const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const glob = require('glob');
const fs = require('fs');

/* ===== Crear instancia expressJs ======================================================================= */
const app = express();

/* ===== Configurar uso de Mustache ====================================================================== */
app.set('views', __dirname+'/views');
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

/* ===== Definir carpeta para recursos estáticos ========================================================= */
app.use(express.static(__dirname + '/public'));

/* ===== Otras configuraciones del proyecto ============================================================== */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.disable('x-powered-by');

/* ===== Cargar módulos (GET) ============================================================================ */
try {
    (async () => {
        const listEndpoints = (glob.sync('./web/**/*.js')).sort();
        listEndpoints.forEach((endpoint) => {
            const relativePath = path.relative(__dirname, endpoint);
            app.use(require('./' + relativePath));
        });
    })();
} catch (error) {
    console.error('[load:endpoints:get]', error.message);
}

/* ===== Cargar módulos (POST) =========================================================================== */
try {
    (async () => {
        const listEndpoints = (glob.sync('./backend/*.js')).sort();
        listEndpoints.forEach((endpoint) => {
            const relativePath = path.relative(__dirname, endpoint);
            app.use(require('./' + relativePath));
        });
    })();
} catch (error) {
    console.error('[load:endpoints:post]', error.message);
}

/* ===== Levantar servidor =============================================================================== */
const { port } = require(path.resolve('./config/express.json'));
app.listen(port, () => {
    console.log(`🦄 Proyecto operativo en el puerto ${port}`);
});

/* ===== Cargar arhivos crons ============================================================================ */
try {
    const cronsFiles = fs.readdirSync(path.resolve('./crons')).filter(file => file.endsWith('.js'));
    for(file of cronsFiles) {
        const cron = require(path.resolve(`./crons/${file}`))();
        cron.start();
    }
} catch(error) {
    console.error('[load:crons]', error.message);
}