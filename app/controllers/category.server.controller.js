var mongoose = require('mongoose'),
    Category = mongoose.model('Category');

exports.render = function (req, res) {
    res.render('categories', {
        title: 'categories'
    });
};

//REST API
exports.getSingleCategory = function (req, res) {
    var id = req.params.id;
    if (!id)
        return res.status(400).send('Invalid or non-existant id.');

    Category.findOne({
            _id: id
        },
        function (err, category) {
            if (err) {
                console.log(err);
                return res.status(400)
                    .send({
                        message: getErrorMessage(err)
                    });
            } else {
                res.json(category);
            }
        }
    );
};
exports.listCategories = function (req, res) {
    Category.find()
        .exec(function (err, categories) {
            if (err) {
                return res.status(400)
                    .send({
                        message: getErrorMessage(err)
                    });
            } else {
                res.json(categories);
            }
        });
};
exports.addCategory = function (req, res) {
    var cat = new Category(req.body);
    cat.save(function (err) {
        if (err) {
            return res.status(400)
                .send({
                    message: getErrorMessage(err)
                });
        } else {
            res.json(cat);
        }
    });
};
exports.updateCategory = function (req, res) {
    var id = req.params.id;
    var catUpdate = req.body;
    Category.findByIdAndUpdate(id, catUpdate, function (err, category) {
        if (err) {
            console.log(err);
            return res.status(400)
                .send({
                    message: getErrorMessage(err)
                });
        } else {
            res.json(catUpdate);
        }
    });
};
exports.deleteCategory = function (req, res) {
    var id = req.params.id;
    if (!id)
        return false;

    Category.findOne({
            _id: id
        },
        function (err, category) {
            if (err) {
                console.log(err);
                return res.status(400)
                    .send({
                        message: getErrorMessage(err)
                    });
            } else {
                category.remove(function (err) {
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