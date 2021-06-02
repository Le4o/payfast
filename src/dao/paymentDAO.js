function PaymentDAO(connection) {
    this._connection = connection;
}

PaymentDAO.prototype.create = function(payment, callback) {
    this._connection.query('INSERT INTO payments SET ?', payment, callback);
}

PaymentDAO.prototype.update = function(payment, callback) {
    this._connection.query('UPDATE payments SET status = ? where id = ?', [payment.status, payment.id], callback);
}

PaymentDAO.prototype.list = function (callback) {
    this._connection.query('SELECT * FROM payments', callback);
}

PaymentDAO.prototype.searchById = function(id, callback) {
    this._connection.query('SELECT * FROM payments WHERE id = ? LIMIT 1', [id], callback);
}

module.exports = function(){
    return PaymentDAO;
};