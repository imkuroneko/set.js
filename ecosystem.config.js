module.exports = {
    apps : [{
        name      : "SET",
        varsion   : "1.0.0",

        script    : "./app.js",
        exec_mode : "fork",

        watch : true,
        max_restarts : 10,

        cron_restart: '0 8 * * *',

        ignore_watch : [
            "logs",
            "node_modules"
        ],

        watch_options: {
            "followSymlinks": false
        },

        log_date_format : "YYYY-MM-DD HH:mm",
        error_file : "./logs/errors.log",
        out_file   : "./logs/out.log"
    }]
}
