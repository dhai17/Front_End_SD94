const app = angular.module("myAppCustomer", ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/cart-list", {
            templateUrl: "/templates/customer/cart/cart.html",
            controller: "cartController",
        })

        .when("/product-details", {
            templateUrl: "/templates/banHang/online/ChiTietSanPham.html",
            controller: "ChiTietSanPhamController",
        })

        .otherwise({
            redirectTo: "/",
        });
});