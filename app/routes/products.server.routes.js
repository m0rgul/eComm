module.exports = function (app) {
    var products = require('../controllers/products.server.controller');
    app.get('/products', products.render);
    app.route('/api/products')
        .get(products.listProducts)
        .post(products.addProduct);
    app.route('/api/products/:id')
        .get(products.getSingleProduct)
        .put(products.updateProduct)
        .delete(products.deleteProduct);
};