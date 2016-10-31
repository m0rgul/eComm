'use strict';
(function () {
    var app = angular.module("products", ['ngResource', 'ngMaterial']);

    app.controller('listProducts', listProducts);
    listProducts.$inject = ["$scope", "productsService", "$mdDialog"];

    function listProducts($scope, productsService, $mdDialog) {
        $scope.customFullscreen = false;
        $scope.test = "test";

        $scope.products = [];
        productsService.query(function (data) {
            $scope.products = data;
        });

        $scope.newProduct = function newProduct(ev) {
            $mdDialog.show({
                controller: dialogController,
                templateUrl: '/js/angular/products/templates/product.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                locals: {
                    dataToPass: {}
                }
            })
                .then(
                    function (result) {
                        productsService.query(function (data) {
                            $scope.products = data;
                        });
                    });
        };

        $scope.productDetails = function productDetails(cat_id, ev) {
            if (!cat_id)
                return false;

            productsService.get(
                {id: cat_id},
                function (resp) {
                    if (resp) {
                        $mdDialog.show({
                            controller: dialogController,
                            templateUrl: '/js/angular/products/templates/product.tmpl.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: true,
                            fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                            locals: {
                                dataToPass: resp
                            }
                        })
                            .then(function (result) {
                                console.log(result);
                                productsService.query(function (data) {
                                    $scope.products = data;
                                });
                            });
                    } else
                        return false;
                }, function (err) {
                    console.log(err);
                });

        };
    };

    app.controller('dialogController', dialogController);
    dialogController.$inject = ["$scope", "productsService", "$mdDialog", "dataToPass"];

    function dialogController($scope, productsService, $mdDialog, dataToPass) {
        $scope.product = {};
        $scope.update = false;
        if (dataToPass && Object.keys(dataToPass).length > 0) {
            $scope.update = true;
            $scope.product = dataToPass;
        } else
            $scope.product = new productsService();

        $scope.addProduct = function () {
            if (!$scope.update) {
                $scope.product.$save(
                    function (resp) {
                        $mdDialog.hide(true);
                    },
                    function (err) {
                        console.log(err);
                    });
            } else {
                if ($scope.addProd.$valid) {
                    $scope.product.$update(
                        function (resp) {
                            console.log(resp);
                        },
                        function (err) {
                            console.log(err);
                        });
                }
            }
        };

        $scope.deleteProduct = function (product) {
            product.$remove(
                function (resp) {
                    console.log(resp);
                    $mdDialog.hide();
                },
                function (err) {
                    console.log(err);
                });
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };
    };


    app.factory("productsService", ["$resource", function ($resource) {
        return $resource("/api/products/:id", {id: '@_id'}, {
            update: {
                method: 'PUT'
            }
        }, {
            stripTrailingSlashes: false
        });
    }]);
})();