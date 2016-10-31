module.exports = function (app) {
    var category = require('../controllers/category.server.controller');
    app.get('/categories', category.render);

    app.route('/api/category')
        .get(category.listCategories)
        .post(category.addCategory);
    app.route('/api/category/:id')
        .get(category.getSingleCategory)
        .put(category.updateCategory)
        .delete(category.deleteCategory);
};