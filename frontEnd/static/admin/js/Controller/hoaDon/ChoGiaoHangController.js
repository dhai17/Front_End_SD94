
app.controller("ChoGiaoHangController", function ($scope, $http) {
    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    $scope.loadData = function () {
        $http.get("http://localhost:8080/hoaDon/datHang/choGiaoHang/danhSach", { headers }).then(function (response) {
            const pending = response.data;
            $scope.pending = pending;
        });
    }

    $scope.loadData();
    $scope.toggleSelectAll = function () {
        angular.forEach($scope.pending, function (item) {
            item.selected = $scope.selectAll;
        });
        $scope.checkTatCaDaChon();
    };
    // lay ra thong tin nguoi dang nhap
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



    $scope.GiaoTatCa = function () {
        const checkOut_email = decodedToken.email;
        Swal.fire({
            title: 'Xác nhận giao hàng',
            text: 'Các đơn hàng đã được gửi đến đơn vị vận chuyển?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đã bàn giao',
            cancelButtonText: 'Chưa'
        }).then((result) => {
            if (result.isConfirmed) {
                let data = {
                    email_user: checkOut_email
                }
                $http.post("http://localhost:8080/hoaDon/datHang/choGiaoHang/capNhatTrangThai/dangGiaoHang-tatCa", data, { headers })
                    .then(function (response) {
                        const pending = response.data;
                        $scope.$evalAsync(function () {
                            $scope.pending = pending;
                        });
                    });
                Swal.fire('Xác nhận thành công!', '', 'success');
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
        const checkOut_email = decodedToken.email;
        Swal.fire({
            title: 'Xác nhận giao đơn hàng',
            text: 'Giao đơn hàng này cho đơn vị vận chuyển?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không'
        }).then((result) => {
            if (result.isConfirmed) {
                let data = {
                    id: id,
                    email_user: checkOut_email
                }
                $http.post("http://localhost:8080/hoaDon/datHang/choGiaoHang/capNhatTrangThai/dangGiaoHang", data, { headers })
                    .then(function (response) {
                        $scope.loadData();
                    })
                    .catch(function (error) {

                    })

                Swal.fire('Xác nhận thành công!', '', 'success');
            };
        });
    };
    //Tìm kiếm
    $scope.$watch('search', function (newVal) {
        if (newVal) {
            $http.get("http://localhost:8080/hoaDon/datHang/choGiaoHang/timKiem=" + newVal, { headers })
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
        $http.get("http://localhost:8080/hoaDon/datHang/choGiaoHang/timKiemNgay=" + formattedDate, { headers })
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
    //Xác nhận đã chọn

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
        let id_hoaDon = [];
        const checkOut_email = decodedToken.email;
        angular.forEach($scope.pending, function (item) {
            if (item.selected) {
                id_hoaDon.push(item.id);
                Swal.fire({
                    title: 'Xác nhận giao những đơn đã chọn',
                    text: 'Bạn có muốn giao những đơn đã chọn không?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Có',
                    cancelButtonText: 'Không'
                }).then((result) => {
                    if (result.isConfirmed) {
                        let data = {
                            id_hoaDon: id_hoaDon,
                            email_user: checkOut_email
                        }
                        $http.put("http://localhost:8080/hoaDon/datHang/choGiaoHang/giaoDonHang/daChon", data, { headers })
                            .then(function (response) {
                                const pending = response.data;
                                $scope.$evalAsync(function () {
                                    $scope.pending = pending;
                                    $scope.coCheckboxDaChon = false;
                                    $scope.selectAll = false;
                                    Swal.fire('Xác nhận giao đơn thành công!', '', 'success');
                                });
                            });
                    };
                });

            };
        });
    };

    // Hoá đơn chi tiết
    $scope.look = function (pending) {
        const id = pending.id;
        window.location.href = "#!/CTChoGiaoHang?id=" + id;
    };
});

app.controller("CTChoGiaoHang", function ($scope, $routeParams, $http) {
    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    const id = $routeParams.id;
    $http.get("http://localhost:8080/hoaDon/chiTietHoaDon/choGiaoHang/id=" + id, { headers })
        .then(function (response) {
            const respone = response.data;
            const hdct = respone.list_HDCT;
            $scope.hdct = hdct;

            const timeLine_ChoXacNhan = respone.timeLine_ChoXacNhan;
            $scope.timeLine_ChoXacNhan = timeLine_ChoXacNhan;

            const timeLine_ChoGiaoHang = respone.timeLine_ChoGiaoHang;
            $scope.timeLine_ChoGiaoHang = timeLine_ChoGiaoHang;

            const hoaDon = respone.hoaDon;

            $scope.hoaDon = hoaDon;
        });


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

    $scope.downloadAsPDF = function () {

        // tạo đối tượng jsPDF
        // const doc = new jsPDF(); 

        // // Lấy thẻ table
        // const table = document.getElementById('tableBillĐetail2');  

        // // In table ra PDF
        // doc.autoTable( {
        //   head: table.tHead.rows,
        //   body: table.tBodies 
        // });

        // // Save PDF
        // doc.save('table.pdf');

    }
});


