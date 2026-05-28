const sql = require("mssql");

const config = {
    server: "DESKTOP-Q2UQQP6\\SQLEXPRESS",
    database: "ERMS",

    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

sql.connect(config)
    .then(() => {
        console.log("SQL Server Connected");
    })
    .catch(err => {
        console.log(err);
    });

module.exports = sql;