app.controller("PurchaseBillController", function ($scope, $http) {
    $http.get("http://localhost:8080/api/purchasebill/list").then(function (response) {
        const pending = response.data;
        console.log(pending);
        $scope.pending = pending;
    });



    function getStatusText(status) {
        if (status == 0) {
            return "Active";
        } else if (status == 1) {
            return "Expired";
        } else {
            return "Awaiting";
        }
    }

    //Phân trang
    $scope.pager = {
        page: 1,
        size: 8,
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
    //         const promotions = response.data;
    //         promotions.forEach(function (promotion) {
    //             promotion.status2 = getStatusText(promotion.status);
    //             promotion.fomatMaximumValue = fomatMaxValue(promotion.maximumvalue);
    //         });

    //         $scope.$evalAsync(function () {
    //             $scope.promotions = promotions;
    //         })
    //     });
    // }
});




