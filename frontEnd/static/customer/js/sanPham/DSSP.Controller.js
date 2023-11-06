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

    $scope.$watchGroup(['selectedKichCo', 'selectedMauSac'], function (newValues, oldValues) {
        if (newValues[0] !== undefined && newValues[1] !== undefined) {
            let data = {
                kichCo: newValues[0],
                maMauSac: newValues[1],
                sanPhamId: $scope.sanPham.id
            }
            $http.post("http://localhost:8080/customer/sanPham/api/getSoLuong", data, { headers })
                .then(function (response) {
                    let soLuongGet = document.getElementById('customer-sanPham-soLuongHienCo');
                    if (soLuongGet) {
                        soLuongGet.innerText = response.data;
                    }
                });
        }
    });

});