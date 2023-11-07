app.controller("checkOutController", function ($scope, $http) {
    let id_HoaDon = localStorage.getItem("id_HoaDon");
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
    console.log(decodedToken);

    let checkOut_HoTen = document.getElementById('checkOut-HoTen');
    let checkOut_email = document.getElementById('checkOut-email');
    let checkOut_SDT = document.getElementById('checkOut-SDT');
    let checkOut_diaChi = document.getElementById('checkOut-diaChi');
    if (decodedToken) {
        checkOut_HoTen.value = decodedToken.hoTen; 
        checkOut_email.value = decodedToken.email; 
        checkOut_SDT.value = decodedToken.soDienThoai; 
        checkOut_diaChi.value = decodedToken.diaChi; 

    }

    $http.get("http://localhost:8080/api/banHang/online/getHoaDon/" + id_HoaDon, { headers }).then(function (response) {
        const hoaDon = response.data;
        $scope.hoaDon = hoaDon;
    });

    $http.get("http://localhost:8080/api/banHang/online/getHoaDonChiTiet/" + id_HoaDon, { headers }).then(function (response) {
        const hoaDonChiTiet = response.data;
        console.log(hoaDonChiTiet);
        $scope.hoaDonChiTiet = hoaDonChiTiet;
    });
});