const app = angular.module("myApp", ["ngRoute", 'ui.bootstrap']);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/list-khuyenMai", {
            templateUrl: "/templates/admin/KhuyenMai/DanhSach.html",
            controller: "KhuyenMaiController",
        })
        .when("/edit-khuyenMai", {
            templateUrl: "/templates/admin/KhuyenMai/ChinhSua.html",
            controller: "EditKhuyenMaiController",
        })
        .when("/create-khuyenMai", {
            templateUrl: "/templates/admin/KhuyenMai/ThemMoi.html",
            controller: "CreateKhuyenMaiController",
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
        .when("/login", {
            templateUrl: "/templates/admin/login/index.html",
            controller: "loginCtrl",
        })
        .when("/detailed-invoice2", {
            templateUrl: "/templates/admin/detailedInvoice/details2.html",
            controller: "Details2Controller",
        })
        .when("/detailed-invoice3", {
            templateUrl: "/templates/admin/detailedInvoice/details3.html",
            controller: "Details3Controller",
        })
        .when("/detailed-invoice4", {
            templateUrl: "/templates/admin/detailedInvoice/details4.html",
            controller: "Details4Controller",
        })
        .when("/detailed-invoice5", {
            templateUrl: "/templates/admin/detailedInvoice/details5.html",
            controller: "Details5Controller",
        })
        .when('/', {
            templateUrl: "/templates/admin/home.html",
        })
        .otherwise({
            redirectTo: "/",
        });
});

app.config(function ($routeProvider) {
    $routeProvider
        .when("/list-Customer", {
            templateUrl: "/templates/admin/khachHang/list.html",
            controller: "CustomerController",
        })
        .when("/edit-Customer", {
            templateUrl: "/templates/admin/khachHang/edit.html",
            controller: "EditCustomerController",
        })
        .when("/create-Customer", {
            templateUrl: "/templates/admin/khachHang/create.html",
            controller: "CreateCustomerController",
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
            templateUrl: "/templates/admin/sanPham/mau_sac/list.html",
            controller: "ColorrController",
        })
        .when("/create-Color", {
            templateUrl: "/templates/admin/sanPham/mau_sac/create.html",
            controller: "CreateColorController",
        })
        .when("/edit-Color", {
            templateUrl: "/templates/admin/sanPham/mau_sac/edit.html",
            controller: "EditColorController",
        })
        .when("/list-Size", {
            templateUrl: "/templates/admin/sanPham/kich_co/list.html",
            controller: "SizeController",
        })
        .when("/create-Size", {
            templateUrl: "/templates/admin/sanPham/kich_co/create.html",
            controller: "CreateSizeController",
        })
        .when("/edit-Size", {
            templateUrl: "/templates/admin/sanPham/kich_co/edit.html",
            controller: "EditSizeController",
        })
        .when("/list-Img", {
            templateUrl: "/templates/admin/sanPham/hinh_anh/list.html",
            controller: "ImgController",
        })
        .when("/list-Line", {
            templateUrl: "/templates/admin/sanPham/loai_san_pham/list.html",
            controller: "LineController",
        })
        .when("/create-Line", {
            templateUrl: "/templates/admin/sanPham/loai_san_pham/create.html",
            controller: "CreateLineController",
        })
        .when("/edit-Line", {
            templateUrl: "/templates/admin/sanPham/loai_san_pham/edit.html",
            controller: "EditLineController",
        })
        .when("/list-Material", {
            templateUrl: "/templates/admin/sanPham/chat_lieu/list.html",
            controller: "MaterialController",
        })
        .when("/create-Material", {
            templateUrl: "/templates/admin/sanPham/chat_lieu/create.html",
            controller: "CreateMaterialController",
        })
        .when("/edit-Material", {
            templateUrl: "/templates/admin/sanPham/chat_lieu/edit.html",
            controller: "EditMaterialController",
        })
        .when("/list-Producer", {
            templateUrl: "/templates/admin/sanPham/nha_san_xuat/list.html",
            controller: "ProducerController",
        })
        .when("/create-Producer", {
            templateUrl: "/templates/admin/sanPham/nha_san_xuat/create.html",
            controller: "CreateProducerController",
        })
        .when("/edit-Producer", {
            templateUrl: "/templates/admin/sanPham/nha_san_xuat/edit.html",
            controller: "EditProducerController",
        })
        .when("/edit-Product", {
            templateUrl: "/templates/admin/sanPham/san_pham/edit.html",
            controller: "EditProductController",
        })
        .when("/list-Product", {
            templateUrl: "/templates/admin/sanPham/san_pham/list.html",
            controller: "ProductController",
        })
        .when("/create-Product", {
            templateUrl: "/templates/admin/sanPham/san_pham/create.html",
            controller: "CreateProductController",
        })
        .when("/list-CTSP", {
            templateUrl: "/templates/admin/sanPham/san_pham/listSPCT.html",
            controller: "CTSPController",
        })
        .otherwise({
            redirectTo: "/",
        });
});

app.config(function ($routeProvider) {
    $routeProvider
        .when("/list-Staff", {
            templateUrl: "/templates/admin/staff/list.html",
            controller: "NhanVienController",
        })
        .when("/edit-Staff", {
            templateUrl: "/templates/admin/staff/edit.html",
            controller: "EditNhanVienController",
        })
        .when("/create-Staff", {
            templateUrl: "/templates/admin/staff/create.html",
            controller: "CreateNhanVienController",
        })
        .otherwise({
            redirectTo: "/",
        });
});

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/logout', {
        templateUrl: 'templates/admin/login/login.html',
        controller: "loginController",
    });
}]);

//Bán hàng
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/danhSachHoaDon', {
        templateUrl: '/templates/banHang/taiQuay/DanhSachHoaDon.html',
        controller: "danhSachHoaDonController",
    })

    .when('/banHang', {
        templateUrl: '/templates/banHang/taiQuay/BanHang.html',
        controller: "BanHangTaiQuayController",
    });
}]);
