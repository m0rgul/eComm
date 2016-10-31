var mongoose = require('mongoose'),
    Product = mongoose.model('Product');

exports.render = function (req, res) {
    res.render('products', {
        title: 'products'
    });
};

//REST API
exports.getSingleProduct = function (req, res) {
    var id = req.params.id;
    if (!id)
        return res.status(400).send('Invalid or non-existant id.');

    Product.findOne({
            _id: id
        },
        function (err, product) {
            if (err) {
                console.log(err);
                return res.status(400)
                    .send({
                        message: getErrorMessage(err)
                    });
            } else {
                res.json(product);
            }
        }
    );
};
exports.listProducts = function (req, res) {
    Product.find()
        .exec(function (err, products) {
            if (err) {
                return res.status(400)
                    .send({
                        message: getErrorMessage(err)
                    });
            } else {
                res.json(products);
            }
        });
};
exports.addProduct = function (req, res) {
    var product = new Category(req.body);
    product.save(function (err) {
        if (err) {
            return res.status(400)
                .send({
                    message: getErrorMessage(err)
                });
        } else {
            res.json(product);
        }
    });
};
exports.updateProduct = function (req, res) {
    var id = req.params.id;
    var product = req.body;
    Product.findByIdAndUpdate(id, product, function (err, product) {
        if (err) {
            console.log(err);
            return res.status(400)
                .send({
                    message: getErrorMessage(err)
                });
        } else {
            res.json(product);
        }
    });
};
exports.deleteProduct = function (req, res) {
    var id = req.params.id;
    if (!id)
        return false;

    Product.findOne({
            _id: id
        },
        function (err, product) {
            if (err) {
                console.log(err);
                return res.status(400)
                    .send({
                        message: getErrorMessage(err)
                    });
            } else {
                product.remove(function (err) {
                    if (err)
                        return res.status(400)
                            .send({
                                message: getErrorMessage(err)
                            });
                    res.status(200).send({message: "Object has been deleted."});

                })
            }
        });

};

var getErrorMessage = function (err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } else {
        return 'Unknown server error';
    }
};