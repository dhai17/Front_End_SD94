const app = angular.module("myAppCustomer", ["ngRoute"]);

//Gio hang
app.config(function ($routeProvider) {
    $routeProvider
        .when("/cart-list", {
            templateUrl: "/templates/customer/cart/cart.html",
            controller: "cartController",
        })

        .otherwise({
            redirectTo: "/",
        });
});

//San pham
app.config(function ($routeProvider) {
    $routeProvider
        .when("/product-list", {
            templateUrl: "/templates/customer/sanPham/DanhSach.html",
            controller: "danhSachSanPhamController",
        })

        .when("/product-details", {
            templateUrl: "/templates/customer/sanPham/ChiTiet.html",
            controller: "ChiTietSanPhamController",
        })

        .otherwise({
            redirectTo: "/",
        });
});