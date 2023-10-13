app.controller("DaHuyDonController", function ($scope, $http) {

    $scope.loadData = function(){
        $http.get("http://localhost:8080/api/purchasebill/list5").then(function (response) {
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




// xác nhận tạo lại đơn
    $scope.confirm = function (pending) {
        const id_bill = pending.id;
        Swal.fire({
            title: 'Xác nhận tạo lại đơn hàng',
            text: 'Tạo lại hàng này?',
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
                Swal.fire('Tạo lại đơn thành công!', '', 'success');
            };
        });
    };

    

});






