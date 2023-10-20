var app = angular.module('myApp', ["ngRoute"]);

app.controller('loginController', function ($scope) {
    $scope.login = function () {
        // // Xử lý đăng nhập ở đây, ví dụ: kiểm tra tên người dùng và mật khẩu
        // if ($scope.username === 'nguoidung' && $scope.password === 'matkhau') {
        //     alert('Đăng nhập thành công');
        // } else {
        //     alert('Đăng nhập thất bại');
        // }
    };
});
