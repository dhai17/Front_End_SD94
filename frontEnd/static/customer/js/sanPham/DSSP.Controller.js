app.controller("danhSachSanPhamController", function ($scope, $http) {
    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    $http.get("http://localhost:8080/customer/sanPham/danhSach", { headers })
        .then(function (response) {
            const sanPham = response.data;
            $scope.sanPham = sanPham;
        });

    $scope.pager = {
        page: 1,
        size: 8,
        get sanPham() {
            if ($scope.sanPham && $scope.sanPham.length > 0) {
                let start = (this.page - 1) * this.size;
                return $scope.sanPham.slice(start, start + this.size);
            } else {
                // Trả về một mảng trống hoặc thông báo lỗi tùy theo trường hợp
                return [];
            }
        },
        get count() {
            if ($scope.sanPham && $scope.sanPham.length > 0) {
                let start = (this.page - 1) * this.size;
                return Math.ceil(1.0 * $scope.sanPham.length / this.size);
            } else {
                // Trả về 0
                return 0;
            }
        },
        get pageNumbers() {
            const pageCount = this.count;
            const pageNumbers = [];
            for (let i = 1; i <= pageCount; i++) {
                pageNumbers.push(i);
            }
            return pageNumbers;
        }
    };

    $scope.getSanPhamChiTiet = function (sanPham) {
        let id_sanPham = sanPham.id;
        window.location.href = '#!/product-details?id=' + id_sanPham;
    };
});

app.controller("ChiTietSanPhamController", function ($scope, $routeParams, $http) {
    const id_sanPham = $routeParams.id;
    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
    let decodedToken;
    if (token) {
        function parseJwt(token) {
            let base64Url = token.split('.')[1];
            let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            let payload = JSON.parse(jsonPayload);
            return payload;
        }

        decodedToken = parseJwt(token);
    }

    $http.get("http://localhost:8080/customer/sanPham/getSanPham/id=" + id_sanPham, { headers })
        .then(function (response) {
            const sanPham = response.data;
            $scope.sanPham = sanPham;
        });

    $http.get("http://localhost:8080/customer/sanPham/api/getSize/" + id_sanPham, { headers })
        .then(function (response) {
            const kichCo = response.data;
            $scope.kichCo = kichCo;
        });

    $http.get("http://localhost:8080/customer/sanPham/api/getColor/" + id_sanPham, { headers })
        .then(function (response) {
            const mauSac = response.data;
            $scope.mauSac = mauSac;
        });

    $scope.selectKichCo = function (kichCo) {
        $scope.selectedKichCo = kichCo;
        return $scope.selectedKichCo;
    };

    $scope.selectMauSac = function (mauSac) {
        $scope.selectedMauSac = mauSac;
    };

    let soLuongGet;
    let kichCo;
    let maMauSac;

    $scope.$watchGroup(['selectedKichCo', 'selectedMauSac'], function (newValues, oldValues) {
        if (newValues[0] !== undefined && newValues[1] !== undefined) {
            let data = {
                kichCo: newValues[0],
                maMauSac: newValues[1],
                sanPhamId: $scope.sanPham.id
            }
            kichCo = newValues[0];
            maMauSac = newValues[1];
            $http.post("http://localhost:8080/customer/sanPham/api/getSoLuong", data, { headers })
                .then(function (response) {
                    soLuongGet = document.getElementById('customer-sanPham-soLuongHienCo');
                    if (soLuongGet) {
                        soLuongGet.innerText = response.data;
                    }
                });
        }

    });

    $scope.addToCart = function (sanPham) {
        if (token) {
            let data = {
                kichCo: kichCo,
                maMauSac: maMauSac,
                san_pham_id: sanPham.id,
                email: decodedToken.email,
                soLuong: $scope.chonSoLuong,
                donGia: sanPham.gia
            }
    
            $http.post("http://localhost:8080/customer/cart/addToCart", data, { headers })
                .then(function (response) {
                    Swal.fire({
                        icon: "success",
                        title: "Thêm vào giỏ hàng thành công",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                });
        }else{
            Swal.fire({
                icon: "error",
                title: "Bạn cần đăng nhập để sử dụng tính năng này",
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                window.location.href = "http://127.0.0.1:5501/templates/auth/Login.html#!/login";
            });
        }
       
    };

    $scope.muaNgay = function (sanPham) {
        let data = {
            kichCoDaChon: kichCo,
            maMauSac: maMauSac,
            san_pham_id: sanPham.id,
            soLuong: $scope.chonSoLuong,
            donGia: sanPham.gia
        }

        $http.post("http://localhost:8080/api/muaNgay/check-out", data)
            .then(function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Đang chuyển hướng hướng đến trang đặt hàng",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(() => {
                    localStorage.setItem("id_HoaDonMuaNgay", response.data)
                    const id_HoaDonMuaNgay = localStorage.getItem("id_HoaDonMuaNgay");
                    window.location.href = "http://127.0.0.1:5501/templates/banHang/muaNgay/CheckOut.html?id_HoaDonMuaNgay=" + id_HoaDonMuaNgay;
                });
            })
            .catch(function (error) {
                Swal.fire({
                    icon: "error",
                    title: error.data.mess,
                    showConfirmButton: false,
                    timer: 2000
                })
            })
    };
});