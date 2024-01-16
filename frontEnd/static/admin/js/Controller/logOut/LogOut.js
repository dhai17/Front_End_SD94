app.controller('LogoutController', function ($scope, $http) {
    let token = localStorage.getItem('token');

    // $scope.showButtonDangXuat = true;
    // $scope.showButtonDangNhap = true;

    if (token) {
        $scope.showButtonDangXuat = true;
        $scope.showButtonDangNhap = false;
        console.log('a');
    } else if (!token) {
        $scope.showButtonDangXuat = false;
        $scope.showButtonDangNhap = true;
        console.log(token);
        console.log('b');
    }

    $scope.logout = function () {
        localStorage.removeItem('token');
        Swal.fire({
            icon: 'success',
            title: 'Đăng xuất thành công',
            showConfirmButton: false,
            timer: 2000,
        }).then(function () {
            window.location.href = 'http://127.0.0.1:5501/templates/customer/home/index.html#!/';
            window.location.reload();
        });
    };

    $scope.logoutAdmin = function () {
        localStorage.removeItem('token');
        Swal.fire({
            icon: 'success',
            title: 'Đang chuyển hướng ra trang đăng nhập',
            showConfirmButton: false,
            timer: 2000,
        }).then(function () {
            window.location.href = 'http://127.0.0.1:5501/#!/login';
        });
    };

    $scope.DangKy = function () {
        localStorage.removeItem('token');
        Swal.fire({
            icon: 'success',
            title: 'Đang chuyển hướng ra trang đăng ký',
            showConfirmButton: false,
            timer: 2000,
        }).then(function () {
            window.location.href = 'http://127.0.0.1:5501/templates/auth/Register.html#!/';
        });
    };

    $scope.login = function () {
        localStorage.removeItem('token');
        Swal.fire({
            icon: 'success',
            title: 'Đang chuyển hướng ra trang đăng nhập',
            showConfirmButton: false,
            timer: 2000,
        }).then(function () {
            window.location.href = 'http://127.0.0.1:5501/#!/login';
        });
    };
});
