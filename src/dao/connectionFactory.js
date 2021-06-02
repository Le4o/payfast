const mysql = require('mysql2');

createDbConnection = () => {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'payfast'
    });
}

// con = createDbConnection();
// con.connect(function(err) {
//     if (err) {
//       console.error('error connecting: ' + err.stack);
//       return;
//     }
   
//     console.log('connected as id ' + connection.threadId);
//   });
// console.log(con);

module.exports = () => createDbConnection;
