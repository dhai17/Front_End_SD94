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
        .when("/detailed-invoice", {
            templateUrl: "/templates/admin/detailedInvoice/detailedInvoice.html",
            controller: "DetailsController",
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
        .when("/edit-Product", {
            templateUrl: "/templates/admin/product/edit.html",
            controller: "EditProductController",
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

app.config(function ($routeProvider) {
    $routeProvider
        .when("/list-Color", {
            templateUrl: "/templates/admin/colorr/list.html",
            controller: "ColorrController",
        })
        .when("/create-Color", {
            templateUrl: "/templates/admin/colorr/create.html",
            controller: "CreateColorController",
        })
        .when("/list-Size", {
            templateUrl: "/templates/admin/size/list.html",
            controller: "SizeController",
        })
        .when("/create-Size", {
            templateUrl: "/templates/admin/size/create.html",
            controller: "CreateSizeController",
        })
        .when("/edit-Size", {
            templateUrl: "/templates/admin/size/edit.html",
            controller: "EditSizeController",
        })
        .when("/list-Img", {
            templateUrl: "/templates/admin/imagess/list.html",
            controller: "ImgController",
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