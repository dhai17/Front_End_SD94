app.controller("DangGiaoHangController", function ($scope, $http) {
    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
    $scope.loadData = function(){
        $http.get("http://localhost:8080/hoaDon/datHang/dangGiaoHang/danhSach", { headers }).then(function (response) {
            const pending = response.data;
            $scope.pending = pending;
        });
    }
    
    $scope.loadData();
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
            title: 'Xác nhận đã giao đơn hàng',
            text: 'Đơn hàng này đã tới tay khách hàng?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đã giao',
            cancelButtonText: 'Chưa'
        }).then((result) => {
            if (result.isConfirmed) {
                let data = {
                    id:id,
                    email_user: checkOut_email
                }
                $http.post("http://localhost:8080/hoaDon/datHang/dangGiaoHang/capNhatTrangThai/daGiaoHang", data, { headers })
            .then(function (response) {
                    $scope.loadData();
            })
            .catch(function (error) {

            })
                Swal.fire('Xác nhận thành công!', '', 'success');
            };
        });
    };

    // từ chối xác nhận ( trạng thái đã huỷ đơn 5)
    $scope.huyDon = function (pending) {
        const id = pending.id;
        const checkOut_email = decodedToken.email;
        
        Swal.fire({
            title: 'Xác nhận huỷ đơn hàng',
            text: 'Bạn có muốn huỷ đơn hàng này không?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không'
        }).then((result) => {
            if (result.isConfirmed) {
                let data = {
                    id:id,
                    email_user: checkOut_email
                }
                $http.post("http://localhost:8080/hoaDon/datHang/dangGiaoHang/capNhatTrangThai/huyDon5", data, { headers })
                .then(function (response) {
                    $scope.loadData();
                    ///end lệnh
                    Swal.fire('Huỷ đơn hàng thành công!', '', 'success');
                })
                .catch(function (error) {
                    console.log(error);
                })

                
            };
        });
        
    };

    //Tìm kiếm
    $scope.$watch('search', function (newVal) {
        if (newVal) {
            $http.get("http://localhost:8080/hoaDon/datHang/dangGiaoHang/timKiem=" + newVal, { headers })
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
        $http.get("http://localhost:8080/hoaDon/datHang/dangGiaoHang/timKiemNgay=" + formattedDate, { headers })
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
        window.location.href = "#!/detailed-invoice3?id=" + id;
    };
});

app.controller("Details3Controller", function ($scope, $routeParams, $http) {
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
            const hdct = invoice.hoaDonChiTiets;
            $scope.hdct = hdct;
            const lshd = invoice.lichSuHoaDons;
            $scope.lshd = lshd;
            const hoaDon = invoice.hoaDon;
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





