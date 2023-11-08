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

    if (decodedToken) {
        $scope.hoTen = decodedToken.hoTen;
        $scope.email = decodedToken.email;
        $scope.soDienThoai = decodedToken.soDienThoai;
        $scope.diaChi = decodedToken.diaChi;
    }

    $http.get("http://localhost:8080/api/banHang/online/getHoaDon/" + id_HoaDon, { headers }).then(function (response) {
        const hoaDon = response.data;
        $scope.tienTamTinh = hoaDon.tongTienHoaDon;
        $scope.tienShip = hoaDon.tienShip;
        $scope.tongTienHoaDon = hoaDon.tongTienDonHang;
        $scope.hoaDon = hoaDon;
    });

    $http.get("http://localhost:8080/api/banHang/online/getHoaDonChiTiet/" + id_HoaDon, { headers }).then(function (response) {
        const hoaDonChiTiet = response.data;
        $scope.hoaDonChiTiet = hoaDonChiTiet;
    });

    function fomatTien(tien) {
        let chuoiDaLoaiBo = tien.replace(/\./g, '').replace(' ₫', '');
        return parseFloat(chuoiDaLoaiBo);
    }

    $scope.datHang = function () {
        Swal.fire({
            title: 'Xác nhận đặt hàng',
            text: 'Bạn có muốn đặt hàng không?',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                let a = $("#total").text();
                let b = $("#shippingFee").text();
                let c = $("#subtotal").text();

                const tongTienHoaDon = fomatTien(c);
                const tienShip = fomatTien(b);
                const tongTienDonHang = fomatTien(a);

                let data = {
                    id: id_HoaDon,
                    ghiChu: $scope.ghiChu,
                    email: $scope.email,
                    soDienThoai: $scope.soDienThoai,
                    tienShip: tienShip,
                    tongTienHoaDon: tongTienHoaDon,
                    tongTienDonHang: tongTienDonHang,
                    email_user: decodedToken.email
                }
                $http.post("http://localhost:8080/api/banHang/online/datHang", data, { headers })
                    .then(function (response) {
                        Swal.fire({
                            icon: "success",
                            title: "Đặt hàng thành công",
                            showConfirmButton: false,
                            timer: 2000,
                        }).then(()=>{
                            window.location.href = "http://127.0.0.1:5501/templates/customer/home/index.html#!/";
                        })

                    });
            }
        });
    }
});