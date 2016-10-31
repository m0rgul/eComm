(function () {
    var app = angular.module("categories", ['ngResource', 'ngMaterial']);

    app.controller('listCategories', listCategories);
    listCategories.$inject = ["$scope", "categoriesService", "$mdDialog"];

    function listCategories($scope, categoriesService, $mdDialog) {
        $scope.customFullscreen = false;

        $scope.categories = [];
        categoriesService.query(function (data) {
            $scope.categories = data;
        });

        $scope.newCategory = function newCategory(ev) {
            $mdDialog.show({
                controller: dialogController,
                templateUrl: '/js/angular/categories/templates/category.tmpl.html',
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
                        categoriesService.query(function (data) {
                            $scope.categories = data;
                        });
                    });
        };

        $scope.catDetails = function catDetails(cat_id, ev) {
            if (!cat_id)
                return false;

            categoriesService.get(
                {id: cat_id},
                function (resp) {
                    if (resp) {
                        $mdDialog.show({
                            controller: dialogController,
                            templateUrl: '/js/angular/categories/templates/category.tmpl.html',
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
                                categoriesService.query(function (data) {
                                    $scope.categories = data;
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
    dialogController.$inject = ["$scope", "categoriesService", "$mdDialog", "$http", "dataToPass"];

    function dialogController($scope, categoriesService, $mdDialog, $http, dataToPass) {
        $scope.category = {};
        $scope.update = false;
        if (dataToPass && Object.keys(dataToPass).length > 0) {
            $scope.update = true;
            $scope.category = dataToPass;
        } else
            $scope.category = new categoriesService();

        $scope.addCategory = function () {
            if (!$scope.update) {
                $scope.category.$save(
                    function (resp) {
                        $mdDialog.hide(true);
                    },
                    function (err) {
                        console.log(err);
                    });
            } else {
                if ($scope.addCat.$valid) {
                    $scope.category.$update(
                        function (resp) {
                            console.log(resp);
                        },
                        function (err) {
                            console.log(err);
                        });
                }
            }
        };

        $scope.deleteCategory = function (category) {
            category.$remove(
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

    app.factory("categoriesService", ["$resource", function ($resource) {
        return $resource("/api/category/:id", {id: '@_id'}, {
            update: {
                method: 'PUT'
            }
        }, {
            stripTrailingSlashes: false
        });
    }]);
})();