app.controller("BanHangTaiQuayController", function ($scope, $http, $routeParams) {
    const id_HoaDonTaiQuay = $routeParams.id
    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    function parseJwt(token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        let payload = JSON.parse(jsonPayload);
        return payload;
    }

    let decodedToken = parseJwt(token);

    $http.get("http://localhost:8080/api/banHang/taiQuay/getHoaDonChitiet/" + id_HoaDonTaiQuay, { headers })
        .then(function (response) {
            const hoaDonChiTiet = response.data;
            $scope.hoaDonChiTiet = hoaDonChiTiet;
        });

    $http.get("http://localhost:8080/api/banHang/taiQuay/getHoaDon/" + id_HoaDonTaiQuay, { headers })
        .then(function (response) {
            const hoaDon = response.data;
            console.log(hoaDon);
            $scope.hoaDon = hoaDon;
        });

    $scope.quayLai = function () {
        window.location.href = "#!/danhSachHoaDon";
    }
});