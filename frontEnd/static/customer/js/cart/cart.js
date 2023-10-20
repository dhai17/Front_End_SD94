app.controller("cartController", function ($scope, $http) {
    $http.get("http://localhost:8080/api/cart/list", { params: { customer_id: 14 } }).then(function (response) {
        const promotions = response.data;
        $scope.promotions = promotions;
    });

    $scope.onInputChange = function (promotion) {
        if (promotion.quanTity !== promotion.initialQuantity) {
            promotion.showButtons = true;
        } else {
            promotion.showButtons = false;
        }
    };

    $scope.updateValue = function (promotion) {
        const idCart = promotion.id;
        const quantity = $("#quantityInput").val();
        let data = {
            id: idCart,
            quanTity: quantity
        }
        $http.post("http://localhost:8080/api/cart/update/quantity/product", data).then(function (response) {
            const promotions = response.data;
            $scope.promotions = promotions;
            $scope.$evalAsync(function () {
                $scope.promotions = promotions;
                Swal.fire({
                    icon: "success",
                    title: "Xóa thành công",
                    showConfirmButton: false,
                    timer: 2000,
                });
            });
        });

        promotion.showButtons = false;
    };

    $scope.cancelUpdate = function (promotion) {
        $http.get("http://localhost:8080/api/cart/list", { params: { customer_id: 14 } }).then(function (response) {
            const promotions = response.data;
            $scope.promotions = promotions;
        });
    };


    $scope.deletecart = function (promotion) {
        let id_cart_details = promotion.id;
        Swal.fire({
            title: 'Xác nhận xóa khách hàng',
            text: 'Bạn có chắc chắn muốn xóa khách hàng này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                let data = {
                    id: id_cart_details,
                    // unitPrice: promotion.unitPrice
                }
                $http.post("http://localhost:8080/api/cart/delete/cartDetails", data)

                    .then(function (response) {
                        const promotions = response.data;
                        promotions.forEach(function (promotion) {
                        });

                        // Cập nhật lại dữ liệu trong bảng mà không load lại trang
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
                        console.log("Lỗi");
                    });
            }
        });
    }
});