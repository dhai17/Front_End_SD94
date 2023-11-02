app.controller("ChoXacNhanController", function ($scope, $http) {
    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
    $scope.loadData = function () {
        $http.get("http://localhost:8080/hoaDon/datHang/choXacNhan/danhSach", { headers }).then(function (response) {
            const pending = response.data;
                $scope.pending = pending;
        });
    }

    $scope.loadData();

    

    $scope.GiaoTatCa = function () {
        Swal.fire({
            title: 'Xác nhận giao hàng',
            text: 'Bạn có muốn giao tất cả đơn hàng không?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không'
        }).then((result) => {
            if (result.isConfirmed) {
                $http.delete("http://localhost:8080/hoaDon/datHang/choXacNhan/xacNhanDon/tatCa", { headers })
                    .then(function (response) {
                        const pending = response.data;
                        
                        $scope.$evalAsync(function () {
                            $scope.pending = pending;
                        });
                        Swal.fire('Xác nhận thành công!', '', 'success');
                    })
                    .catch(function (error) {
                        console.log(error);
                        Swal.fire('Đã xảy ra lỗi!', '', 'error');
                    });
                
            };
        });
    };


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





    // xác nhận đơn
    $scope.confirm = function (pending) {
        const id = pending.id;
        let data = {
            id
        }
        Swal.fire({
            title: 'Xác nhận đơn hàng',
            text: 'Bạn có muốn giao đơn hàng này không?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không'
        }).then((result) => {
            if (result.isConfirmed) {
                $http.post("http://localhost:8080/hoaDon/datHang/choXacNhan/capNhatTrangThai/daXacNhan", data, { headers })
                    .then(function (response) {
                        const pending = response.data;
                        
                        $scope.$evalAsync(function () {
                            $scope.pending = pending;
                        });
                    })
                    .catch(function (error) {

                    })
                Swal.fire('Xác nhận thành công!', '', 'success');
            };
        });
    };

    // từ chối xác nhận ( trạng thái đã huỷ đơn 5)
    $scope.refuseBill = function (pending) {
        const id_bill = pending.id;
        // console.log(id_bill);

        Swal.fire({
            title: 'Xác nhận huỷ đơn hàng',
            text: 'Bạn có muốn huỷ đơn hàng này không?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không'
        }).then((result) => {
            if (result.isConfirmed) {
                $http.post("http://localhost:8080/hoaDon/datHang/choXacNhan/capNhatTrangThai/huyDon", { id_bill: id_bill }, { headers })
                    .then(function (response) {
                        $scope.loadData();
                    })
                    .catch(function (error) {
                    })
                Swal.fire('Huỷ đơn hàng thành công!', '', 'success');
            };
        });

    };

    //Tìm kiếm
    $scope.$watch('search', function (newVal) {
        if (newVal) {
            $http.get("http://localhost:8080/hoaDon/datHang/choXacNhan/timKiem=" + newVal, { headers })
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

    $scope.look = function (pending) {
        const id = pending.id;
        window.location.href = "#!/detailed-invoice?id=" + id;
    };


    //Tìm kiếm ngày bắt đầu
    $scope.searchDateBill = function (searchDate) {
        let formattedDate = formatDate(searchDate);

        // Tiếp tục với yêu cầu HTTP và xử lý dữ liệu
        $http.get("http://localhost:8080/hoaDon/datHang/choXacNhan/timKiemNgay=" + formattedDate, { headers })
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
    // check don da chon
    $scope.coCheckboxDaChon = false;

    $scope.toggleSelectAll = function () {
        angular.forEach($scope.pending, function (item) {
            item.selected = $scope.selectAll;
        });
        $scope.checkTatCaDaChon();
    };

    $scope.updateSelectAll = function () {
        $scope.selectAll = $scope.pending.every(function (item) {
            return item.selected;
        });
        $scope.checkTatCaDaChon();
    };

    $scope.checkTatCaDaChon = function () {
        $scope.coCheckboxDaChon = $scope.pending.some(function (item) {
            return item.selected;
        });
    };

    $scope.xacNhanDonDaChon = function () {
        let danhSachDonDuocChon = [];
        angular.forEach($scope.pending, function (item) {
            if (item.selected) {
                danhSachDonDuocChon.push(item.id);
                Swal.fire({
                    title: 'Xác nhận những đơn đã chọn',
                    text: 'Bạn có muốn xác nhận những đơn đã chọn không?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Có',
                    cancelButtonText: 'Không'
                }).then((result) => {
                    if (result.isConfirmed) {
                        $http.put("http://localhost:8080/hoaDon/datHang/choXacNhan/xacNhanDon/daChon", { id: danhSachDonDuocChon }, { headers })
                            .then(function (response) {
                                const pending = response.data;
                                $scope.$evalAsync(function () {
                                    $scope.pending = pending;
                                    $scope.coCheckboxDaChon = false;
                                    $scope.selectAll = false
                                });
                            });
                        Swal.fire('Xác nhận đơn thành công!', '', 'success');
                    };
                });

            };
        });
    };
    $scope.huyDonDaChon = function () {
        const danhSachDonDuocChon = [];
        angular.forEach($scope.pending, function (item) {
            if (item.selected) {
                danhSachDonDuocChon.push(item.id);
                Swal.fire({
                    title: 'Hủy những đơn đã chọn',
                    text: 'Bạn có muốn hủy những đơn đã chọn không?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Có',
                    cancelButtonText: 'Không'
                }).then((result) => {
                    if (result.isConfirmed) {
                        $http.put("http://localhost:8080/hoaDon/datHang/choXacNhan/huyDon/daChon", { id: danhSachDonDuocChon }, { headers })
                            .then(function (response) {
                                const pending = response.data;
                                $scope.$evalAsync(function () {
                                    $scope.pending = pending;
                                    $scope.coCheckboxDaChon = false;
                                    $scope.selectAll = false
                                });
                            });
                        Swal.fire('Hủy tất cả đơn thành công!', '', 'success');
                    };
                });
            };
        });
    };
});

app.controller("DetailsController", function ($scope, $routeParams, $http) {
    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
    const id = $routeParams.id;
    $scope.loadData = function(){
        $http.get("http://localhost:8080/hoaDon/chiTietHoaDon/choXacNhan/id="+id, { headers })
        .then(function (response) {
            const invoice = response.data;
            $scope.invoice = invoice;
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




