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

    $scope.delete = function (promotion) {
        let idPro = promotion.id;
        console.log(idPro)
        $http.delete("http://localhost:8080/api/product/deleteProduct/" + idPro)
            .then(function (response) {
                const promotions = response.data;

                promotions.forEach(function (promotion) {
                    promotion.status2 = getStatusText(promotion.status);
                });

                $scope.$evalAsync(function () {
                    $scope.promotions = promotions;
                    Swal.fire({
                        icon: "success",
                        title: "Xóa thành công",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                });

            })
            .catch(function (error) {
                console.log("Error");
            });
    }
});

app.controller("detailsController", function ($scope, $routeParams, $http) {
    const id = $routeParams.id;
    $http.get("http://localhost:8080/api/getColor", { params: { product_id: id } })
        .then(function (response) {
            const color = response.data;
            console.log(color);
            $scope.color = color;
        });

    $http.get("http://localhost:8080/api/getSize", { params: { product_id: id } })
        .then(function (response) {
            const size = response.data;
            $scope.size = size;
        });
});
