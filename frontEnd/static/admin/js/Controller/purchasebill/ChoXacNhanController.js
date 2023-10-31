app.controller("ChoXacNhanController", function ($scope, $http) {
    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
    $scope.loadData = function () {
        $http.get("http://localhost:8080/api/purchasebill/list1", { headers }).then(function (response) {
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
                $http.put("http://localhost:8080/api/bill/pending2/confirm-all2", { headers })
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




    // //Re load
    // $scope.reLoad = function () {
    //     $http.get("http://localhost:8080/api/discount/list").then(function (response) {
    //         const pending = response.data;
    //         $scope.$evalAsync(function () {
    //             $scope.pending = pending;
    //         })
    //     });
    // }
    // xác nhận đơn
    $scope.confirm = function (pending) {
        const id_bill = pending.id;
        Swal.fire({
            title: 'Xác nhận đơn hàng',
            text: 'Bạn có muốn giao đơn hàng này không?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không'
        }).then((result) => {
            if (result.isConfirmed) {
                $http.post("http://localhost:8080/api/bill/pending2", { id_bill: id_bill }, { headers })
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
                $http.post("http://localhost:8080/api/bill/refuse", { id_bill: id_bill }, { headers })
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
            $http.get("http://localhost:8080/api/bill/pending1/search=" + newVal, { headers })
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
    // $scope.searchBill = function (search) {
    //     $http.get("http://localhost:8080/api/bill/pending1/search=" + search)
    //         .then(function (response) {
    //             const pending = response.data;

    //             // Cập nhật lại dữ liệu trong table nhưng không load lại trang
    //             $scope.$evalAsync(function () {
    //                 $scope.pending = pending;
    //             });
    //         });
    // }

    //Tìm kiếm ngày bắt đầu
    $scope.searchDateBill = function (searchDate) {
        let formattedDate = formatDate(searchDate);

        // Tiếp tục với yêu cầu HTTP và xử lý dữ liệu
        $http.get("http://localhost:8080/api/bill/pending1/searchDate=" + formattedDate, { headers })
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
});

app.controller("DetailsController", function ($scope, $routeParams, $http) {
    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
    const id = $routeParams.id;
    $scope.loadData = function(){
        $http.get("http://localhost:8080/api/detailedInvoice/pending1/id="+id, { headers })
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




