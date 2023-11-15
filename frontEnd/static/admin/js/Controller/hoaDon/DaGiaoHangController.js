app.controller("DaGiaoHangController", function ($scope, $http) {
    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
    $scope.loadData = function () {
        $http.get("http://localhost:8080/hoaDon/datHang/daGiaoHang/danhSach", { headers }).then(function (response) {
            const pending = response.data;
            $scope.pending = pending;
        });
    }

    $scope.loadData();


    //Phân trang
    $scope.pager = {
        page: 1,
        size: 4,
        get pending() {
            if ($scope.pending && $scope.pending.length > 0) {
                let start = (this.page - 1) * this.size;
                return $scope.pending.slice(start, start + this.size);
            } else {
                // Trả về một mảng trống hoặc thông báo lỗi tùy theo trường hợp
                return [];
            }
        },
        get count() {
            if ($scope.pending && $scope.pending.length > 0) {
                let start = (this.page - 1) * this.size;
                return Math.ceil(1.0 * $scope.pending.length / this.size);
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



    //Tìm kiếm
    $scope.$watch('search', function (newVal) {
        if (newVal) {
            $http.get("http://localhost:8080/hoaDon/datHang/daGiaoHang/timKiem=" + newVal, { headers })
                .then(function (response) {
                    const pending = response.data;

                    // Cập nhật lại dữ liệu trong table nhưng không load lại trang
                    $scope.$evalAsync(function () {
                        $scope.pending = pending;
                    });
                });
        } else {
            $scope.loadData();
        }
    });

    //Tìm kiếm ngày bắt đầu
    $scope.searchDateBill = function (searchDate) {
        let formattedDate = formatDate(searchDate);

        // Tiếp tục với yêu cầu HTTP và xử lý dữ liệu
        $http.get("http://localhost:8080/hoaDon/datHang/daGiaoHang/timKiemNgay=" + formattedDate, { headers })
            .then(function (response) {
                const pending = response.data;

                $scope.$evalAsync(function () {
                    $scope.pending = pending;
                })
            });
    }


    function formatDate(dateString) {
        let date = new Date(dateString);
        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);
        return year + "-" + month + "-" + day;
    }

    //Re load
    $scope.reLoad = function () {
        $scope.loadData();
    }
    // Hoá đơn chi tiết
    $scope.look = function (pending) {
        const id = pending.id;
        window.location.href = "#!/CTDaGiaoHang?id=" + id;
    };

});
app.controller("CTDaGiaoHang", function ($scope, $routeParams, $http) {
    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
    const id = $routeParams.id;
    $scope.loadData = function () {
        $http.get("http://localhost:8080/hoaDon/chiTietHoaDon/daGiaoHang/id=" + id, { headers })
            .then(function (response) {
                const respone = response.data;
                const hdct = respone.list_HDCT;
                $scope.hdct = hdct;

                const timeLine_ChoXacNhan = respone.timeLine_ChoXacNhan;
                $scope.timeLine_ChoXacNhan = timeLine_ChoXacNhan;

                const timeLine_ChoGiaoHang = respone.timeLine_ChoGiaoHang;
                $scope.timeLine_ChoGiaoHang = timeLine_ChoGiaoHang;

                const timeLine_DangGiaoHang = respone.timeLine_DangGiaoHang;
                $scope.timeLine_DangGiaoHang = timeLine_DangGiaoHang;

                const timeLine_DaGiaoHang = respone.timeLine_DaGiaoHang;
                $scope.timeLine_DaGiaoHang = timeLine_DaGiaoHang;

                const hoaDon = respone.hoaDon;

                $scope.hoaDon = hoaDon;
            });
    }

    $scope.loadData();
    //Phân trang
    $scope.pager = {
        page: 1,
        size: 4,
        get invoice() {
            if ($scope.invoice && $scope.invoice.length > 0) {
                let start = (this.page - 1) * this.size;
                return $scope.invoice.slice(start, start + this.size);
            } else {
                // Trả về một mảng trống hoặc thông báo lỗi tùy theo trường hợp
                return [];
            }
        },
        get count() {
            if ($scope.invoice && $scope.invoice.length > 0) {
                let start = (this.page - 1) * this.size;
                return Math.ceil(1.0 * $scope.invoice.length / this.size);
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
});





