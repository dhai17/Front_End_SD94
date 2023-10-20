app.controller("detailedInvoiceController", function ($scope, $http) {

    $scope.loadData = function(){
        $http.get("http://localhost:8080/api/detailedInvoice/pending1/hoa-don-id=" +  {id_bill: id_bill})
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




