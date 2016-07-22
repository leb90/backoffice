var mysql = require('mysql');

var connection = mysql.createConnection(ConfigServer.mysql);
connection.connect(function(err) {
    if (!err) {
        console.log("Database esta conectada");
        connection.config.queryFormat = function(query, values) {
            if (!values) return query;
            return query.replace(/\:(\w+)/g, function(txt, key) {
                if (values.hasOwnProperty(key)) {
                    return this.escape(values[key]);
                }
                return txt;
            }.bind(this));
        };
    } else {
        console.log("Error no conectando");
    }
});
module.exports = connection;
