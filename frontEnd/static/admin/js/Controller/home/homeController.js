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
        .when("/list-PurchaseBill", {

            templateUrl: "/templates/admin/purchasebill/ChoXacNhan.html",
            controller: "ChoXacNhanController",
        })
        .when("/cho-giao-hang", {
            templateUrl: "/templates/admin/purchasebill/ChoGiaoHang.html",
            controller: "ChoGiaoHangController",
        })
        .when("/dang-giao", {
            templateUrl: "/templates/admin/purchasebill/DangGiaoHang.html",
            controller: "DangGiaoHangController",
        })
        .when("/da-giao", {
            templateUrl: "/templates/admin/purchasebill/DaGiaoHang.html",
            controller: "DaGiaoHangController",
        })
        .when("/da-huy", {
            templateUrl: "/templates/admin/purchasebill/DaHuyDon.html",
            controller: "DaHuyDonController",
        })
        .otherwise({
            redirectTo: "/",
        });
});

app.config(function ($routeProvider) {
    $routeProvider
        .when("/list-Customer", {
            templateUrl: "/templates/admin/customer/list.html",
            controller: "CustomerController",
        })
        .when("/edit-Customer", {
            templateUrl: "/templates/admin/customer/edit.html",
            controller: "EditCustomerController",
        })
        .when("/create-Customer", {
            templateUrl: "/templates/admin/customer/create.html",
            controller: "CreateCustomerController",
        })
        .otherwise({
            redirectTo: "/",
        });
});

app.config(function ($routeProvider) {
    $routeProvider
        .when("/list-Staff", {
            templateUrl: "/templates/admin/staff/list.html",
            controller: "StaffController",
        })
        .when("/edit-Staff", {
            templateUrl: "/templates/admin/staff/edit.html",
            controller: "EditStaffController",
        })
        .when("/create-Staff", {
            templateUrl: "/templates/admin/staff/create.html",
            controller: "CreateStaffController",
        })
        .otherwise({
            redirectTo: "/",
        });
});