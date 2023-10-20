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

        // let detailProduct = {
        //     name: $scope.createProduct.name,
        //     price: $scope.createProduct.price,
        //     origin: $scope.createProduct.origin,
        // };
});

app.controller("CreateBillController", function ($scope, $http) {

    $scope.saveCreate = function () {

        $http.post("http://localhost:8080/api/discount/saveCreate", $scope.createDiscountBill)
            .then(function (response) {
                // Xử lý thành công nếu có
                Swal.fire({
                    icon: "success",
                    title: "Thêm mới thành công",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem("isConfirmed", true);
                    window.location.href = "#!/list-Bill";
                });
            })
            .catch(function (error) {
                if (error.status === 400) {
                    const errorMessage = error.data.message;
                    Swal.fire({
                        icon: "error",
                        title: errorMessage + "",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                } else {
                    // Xử lý lỗi khác nếu cần
                    console.error(error);
                }
            });

    };

    $scope.returnCreate = function () {
        window.location.href = "#!/list-Bill"
    };
});
