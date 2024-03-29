const cron = require('cron');
const axios = require('axios');
const cheerio = require('cheerio');
const SQLite = require('better-sqlite3');
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const script = () => new cron.CronJob(
    '0 2 * * *',
    async function() {
        try {
            const url = "https://www.set.gov.py/web/portal-institucional/listado-de-ruc-con-sus-equivalencias";

            const response = await axios.get(url);
            const html = response.data;

            const $ = cheerio.load(html);

            let i = 0;
            $('div.list__item a.link').each(async (index, element) => {
                const href = $(element).attr('href');

                const webUrl = `https://www.set.gov.py${href}`;

                await axios({ url: webUrl, method: 'GET', responseType: 'arraybuffer' }).then(async (response) => {

                    // Guardar el archivo descargado en /temp
                    fs.writeFileSync(path.resolve(`./temp/ruc${i}.zip`), response.data);

                    // Descomprimir el archivo y guardar todo en la carpeta /temp
                    const zip = new AdmZip(path.resolve(`./temp/ruc${i}.zip`));
                    zip.extractAllTo(path.resolve(`./temp`));

                    // Eliminar el archivo zip descargado (ya no nos sirve)
                    fs.unlinkSync(path.resolve(`./temp/ruc${i}.zip`));

                    // Abrir el archivo de base de datos
                    const sql = new SQLite(path.resolve('./data/ruc.sqlite'));
    
                    // Leer el archivo txt
                    const fileContent = fs.readFileSync(path.resolve(`./temp/ruc${i}.txt`), 'utf-8');
                    const lines = fileContent.split('\n');

                    // Tratar el contenido de cada archivo txt
                    lines.forEach(async (line) => {
                        const [ ruc_actual, razon_social, dv, ruc_anterior, estado ] = line.split('|');

                        try {
                            const sqlQuery = ` INSERT INTO
                                contribuyentes ( ruc_actual, ruc_anterior, digito_verificador, razon_social, estado )
                                VALUES ( @rn, @rv, @dv, @rs, @es )
                                ON CONFLICT(ruc_actual) DO UPDATE SET estado = @es ;
                            `;
                            const query = sql.prepare(sqlQuery);
                            query.run({ rn: ruc_actual, rv: ruc_anterior, dv: dv, rs: razon_social, es: estado });
                        } catch(error) {
                            console.error('[cronjob:set_update_info:sqlite]', error.message);
                        }
                    });

                    // Eliminar el archivo txt (ya no nos sirve)
                    fs.unlinkSync(path.resolve(`./temp/ruc${i}.txt`));
                });
                i++;
            });
        } catch(error) {
            console.error('[cronjob:set_update_info]', error);
        };
    }, null, false);

// Module export ===========================================================================================================
module.exports = script;
