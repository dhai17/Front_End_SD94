app.controller("danhSachSanPhamTaiQuayController", function ($scope, $http) {
    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    $http.get("http://localhost:8080/customer/sanPham/danhSach", { headers })
        .then(function (response) {
            const sanPham = response.data;
            console.log(sanPham);
            $scope.sanPham = sanPham;
        });

    $scope.pager = {
        page: 1,
        size: 12,
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
        window.location.href = '#!/product-details-taiQuay?id=' + id_sanPham;
    };
});

app.controller("ChiTietSanPhamTaiQuayController", function ($scope, $routeParams, $http, $window) {
    const id_sanPham = $routeParams.id;
    const id_HD_TaiQuay = localStorage.getItem("id_HD_TaiQuay");
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

    $http.get("http://localhost:8080/customer/sanPham/getAnhSanPham/" + id_sanPham)
        .then(function (response) {
            const hinhAnh_list = response.data;
            $scope.hinhAnhs = hinhAnh_list;
        });

    $http.get("http://localhost:8080/customer/sanPham/getAnhMacDinhSanPham/" + id_sanPham)
        .then(function (response) {
            const hinhAnh = response.data.anhMacDinh;
            $scope.hinhAnh = hinhAnh;
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

    let soLuongHienCo;

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
                        soLuongHienCo = response.data;
                    }
                });
        }

    });

    $scope.maMauSac = "";
    $scope.$watch('selectedMauSac', function (newVal, oldVal) {
        if (newVal !== undefined) {
            $scope.maMauSac = newVal;
            let data = {
                id_SP: id_sanPham,
                maMauSac: $scope.maMauSac
            }
            $http.post("http://localhost:8080/customer/sanPham/getAnhByMauSac", data)
                .then(function (response) {
                    const hinhAnh = response.data.anh;
                    $scope.hinhAnh = hinhAnh;
                });
        }
    });

    $scope.quayLai = function () {
        $window.history.back();
    }

    $scope.themSanPham = function (sanPham) {
        if ($scope.chonSoLuong > soLuongHienCo) {
            Swal.fire({
                icon: "error",
                title: "Số lượng thêm không được lớn hơn số lượng hiện có",
                showConfirmButton: false,
                timer: 2000
            });
            $scope.chonSoLuong = soLuongHienCo
            return;
        } else if ($scope.chonSoLuong < 0) {
            Swal.fire({
                icon: "error",
                title: "Số lượng thêm không được nhỏ hơn 0",
                showConfirmButton: false,
                timer: 2000
            });
            $scope.chonSoLuong = 1;
            return;
        } else {
            let data = {
                id_hoaDon: id_HD_TaiQuay,
                kichCoDaChon: kichCo,
                maMauSac: maMauSac,
                san_pham_id: sanPham.id,
                soLuong: $scope.chonSoLuong,
                donGia: sanPham.gia
            }

            $http.post("http://localhost:8080/api/banHang/taiQuay/themSanPham", data, { headers })
                .then(function (response) {
                    Swal.fire({
                        icon: "success",
                        title: "Thêm sản phẩm thành công",
                        showConfirmButton: false,
                        timer: 2000,
                    }).then(() => {
                        window.location.href = "#!/banHang?id=" + id_HD_TaiQuay;
                    });
                })
                .catch(function (e) {
                  const errorMessage = e.data[Object.keys(e.data)[0]];
                  Swal.fire({
                    icon: "error",
                    title: errorMessage,
                    showConfirmButton: false,
                    timer: 2000,
                  });
                });
        }
    };
});