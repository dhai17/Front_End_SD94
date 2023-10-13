app.controller("ListProductController", function ($scope, $http) {
    $http.get("http://localhost:8080/api/product/list")
        .then(function (response) {
            const promotions = response.data;
            promotions.forEach(function (promotion) {
                promotion.status2 = getStatusText(promotion.status);
            });
            $scope.promotions = promotions;
        });


    function getStatusText(status) {
        if (status == 0) {
            return "Active";
        } else if (status == 1) {
            return "Expired";
        } else {
            return "Awaiting";
        }
    };

    $scope.showDetails = function (promotion) {
        let id = promotion.id;
        window.location.href = '#!/details-product?id=' + id;
    };
});

app.controller("detailsController", function ($scope, $routeParams, $http) {
    $http.get("http://localhost:8080/api/product/list")
        .then(function (response) {
            const color = response.data;
            $scope.color = color;
        });

    $http.get("http://localhost:8080/api/product/list")
        .then(function (response) {
            const size = response.data;
            $scope.size = size;
        });
});
