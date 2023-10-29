app.controller("DaGiaoHangController", function ($scope, $http) {

    $scope.loadData = function(){
        $http.get("http://localhost:8080/api/purchasebill/list4").then(function (response) {
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




// xác nhận đơn
$scope.confirm = function (pending) {
    const id_bill = pending.id;
    Swal.fire({
        title: 'Xác nhận đơn hàng',
        text: 'Trả lại trạng thái chờ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Có',
        cancelButtonText: 'Không'
    }).then((result) => {
        if (result.isConfirmed) {
            $http.post("http://localhost:8080/api/bill/pending1", {id_bill: id_bill})
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
        $http.get("http://localhost:8080/api/bill/pending4/search=" + newVal)
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
    $http.get("http://localhost:8080/api/bill/pending4/searchDate=" + formattedDate)
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
    window.location.href = "#!/detailed-invoice4?id=" + id;
};

});
app.controller("Details4Controller", function ($scope, $routeParams, $http) {
    const id = $routeParams.id;
    $scope.loadData = function(){
        $http.get("http://localhost:8080/api/detailedInvoice/pending1/id="+id)
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





