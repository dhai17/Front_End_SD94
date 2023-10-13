const app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/list-Discount", {
            templateUrl: "/templates/admin/discount/list.html",
            controller: "DiscountController",
        })
        .when("/edit-Discount", {
            templateUrl: "/templates/admin/discount/edit.html",
            controller: "EditDiscountController",
        })
        .when("/create-Discount", {
            templateUrl: "/templates/admin/discount/create.html",
            controller: "CreateDiscountController",
        })
        .when("/list-ProductDetails", {
            templateUrl: "/templates/admin/productDetails/list.html",
            controller: "ProductDetailsController",
        })
        .when("/create-ProductDetails", {
            templateUrl: "/templates/admin/productDetails/create.html",
            controller: "EditProductDetailsController",
        })
        .when("/edit-ProductDetails", {
            templateUrl: "/templates/admin/productDetails/edit.html",
            controller: "EditProductDetailsController",
        })
        .when("/list-Product", {
            templateUrl: "/templates/admin/product/list.html",
            controller: "ProductController",
        })
        .when("/create-Product", {
            templateUrl: "/templates/admin/product/create.html",
            controller: "CreateProductController",
        })
        .when("/in-store", {
            templateUrl: "/templates/admin/sales/product_list.html",
            controller: "ListProductController",
        })
        .when("/details-product", {
            templateUrl: "/templates/admin/sales/details.html",
            controller: "detailsController",
        })
        .otherwise({
            redirectTo: "/",
        });
});