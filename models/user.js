var connection = require('./connection.js');

var userModel = {};

userModel.getUsers = function(callback) {
    if (connection) {
        connection.query('SELECT id, user_name, email, password, level, phone, status_id FROM `plugins-project`.user Order by id', function(error, rows) {
            if (error) {
                throw error;
            } else {
                callback(null, rows);
            }
        });
    }
}


userModel.getUser = function(id, callback) {
    var ob = {
        id: id
    }
    var query = 'SELECT id, user_name, email, password, level, phone, status_id FROM `plugins-project`.user Where id = :id';
    connection.query(query, ob, function(error, row) {
        if (error) {
            throw error;
        } else {
            callback(null, row);
        }
    });
}

userModel.insertUser = function(userData, callback) {
    console.log(userData);
    if (connection) {
        var ob = {
            user_name: (userData.user_name),
            email: (userData.email),
            status_id: (userData.status_id),
            level: (userData.level),
            phone: (userData.phone),
            password: (userData.password)
        };

        var sql = 'INSERT INTO `plugins-project`.user SET user_name = :user_name, level = :level, email = :email, password = :password, phone = :phone, status_id = :status_id';


        connection.query(sql, ob, function(err, result) {
        if (err) {
            throw err;
        } else {
            callback(null, result);
        }
            console.log(result.insertId);
        });
    }
}
userModel.getLogUser = function(userData, callback) {
    var ob = {

        user_name: (userData.user_name),
        password: (userData.password)

    }
    var query = "SELECT * FROM `plugins-project`.user WHERE user_name = :user_name AND password = :password";
    connection.query(query, ob, function(error, row) {
        if (error) {
            throw error;
        } else {
            callback(null, row);
        }
    });
}

module.exports = userModel;