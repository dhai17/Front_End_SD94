app.controller("CustomerController", function ($scope, $http) {
    $http.get("http://localhost:8080/api/customer/list").then(function (response) {
        const promotions = response.data;
        $scope.promotions = promotions;
    });

    //Phân trang
    $scope.pager = {
        page: 1,
        size: 8,
        get promotions() {
            if ($scope.promotions && $scope.promotions.length > 0) {
                let start = (this.page - 1) * this.size;
                return $scope.promotions.slice(start, start + this.size);
            } else {
                // Trả về một mảng trống hoặc thông báo lỗi tùy theo trường hợp
                return [];
            }
        },
        get count() {
            if ($scope.promotions && $scope.promotions.length > 0) {
                let start = (this.page - 1) * this.size;
                return Math.ceil(1.0 * $scope.promotions.length / this.size);
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

    function fomatMaxValue(dateBirth) {
        return dateBirth.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    //Chuyển hướng đến trang edit theo id
    $scope.editCustomer = function (promotion) {
        let idCustomer = promotion.id;
        window.location.href = '#!/edit-Customer?id=' + idCustomer;
    };

    // Xóa trong danh sách
    $scope.deleteCustomer = function (promotion) {
        let idCustomer = promotion.id;
        $http.put("http://localhost:8080/api/customer/deleteCustomer=" + idCustomer)
            .then(function (response) {
                const promotions = response.data;
                promotions.forEach(function (promotion) {
                });

                // Cập nhật lại dữ liệu trong table nhưng không load lại trang by hduong25
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

    // Tìm kiếm
    $scope.searchAllCustomer = function (searchTerm) {
        $http.get("http://localhost:8080/api/customer/search=" + searchTerm)
            .then(function (response) {
                const promotions = response.data;
                promotions.forEach(function (promotion) {
                });

                // Cập nhật lại dữ liệu trong table nhưng không load lại trang by hduong25
                $scope.$evalAsync(function () {
                    $scope.promotions = promotions;
                });
            });
    }

    $scope.searchDateCustomer = function (selectedDate) {
        let formattedDate = formatDate(selectedDate);

        // Tiếp tục với yêu cầu HTTP và xử lý dữ liệu
        $http.get("http://localhost:8080/api/customer/searchDate=" + formattedDate)
            .then(function (response) {
                const promotions = response.data;
                promotions.forEach(function (promotion) {
                });

                $scope.$evalAsync(function () {
                    $scope.promotions = promotions;
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

    // Re load
    $scope.reLoad = function () {
        $http.get("http://localhost:8080/api/customer/list").then(function (response) {
            const promotions = response.data;
            promotions.forEach(function (promotion) {
            });

            $scope.$evalAsync(function () {
                $scope.promotions = promotions;
            })
        });
    }
});
// ------------------------------------------------------------------------------------------------------------------------------------------
// Create controller
app.controller("CreateCustomerController", function ($scope, $http) {
    $scope.saveCreateCustomer = function () {

        if ($scope.createCustomer === undefined) {
            Swal.fire({
                icon: "error",
                title: "Vui lòng nhập đầy đủ thông tin",
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }

        $http.post("http://localhost:8080/api/customer/createCustomer", $scope.createCustomer)
            .then(function (response) {
                // Xử lý thành công nếu có
                Swal.fire({
                    icon: "success",
                    title: "Thêm mới thành công",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem("isConfirmed", true);
                    window.location.href = "#!/list-Customer";
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
        window.location.href = "#!/list-Customer"
    };
});
// ------------------------------------------------------------------------------------------------------------------------------------------

// //Edit controller
// app.controller("EditStaffController", function ($scope, $routeParams, $http) {
//     let idDiscount = $routeParams.id;

//Edit controller
app.controller("EditCustomerController", function ($scope, $routeParams, $http) {
    let idCustomer = $routeParams.id;


    $http.get("http://localhost:8080/api/customer/edit/customerID=" + idCustomer)
        .then(function (response) {
            const editCustomer = response.data;
            $scope.editCustomer = editCustomer;
        });

    //Lưu edit
    $scope.saveEditCustomer = function () {
        let editCustomer = {
            id: idCustomer,
            name: $scope.editCustomer.name,
            phoneNumber: $scope.editCustomer.phoneNumber,
            email: $scope.editCustomer.email,
            dateBirth: $scope.editCustomer.dateBirth,
            addRess: $scope.editCustomer.addRess,
            passWord: $scope.editCustomer.passWord
        };

        $http.put("http://localhost:8080/api/customer/saveUpdate", editCustomer)
            .then(function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Sửa thành công",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem("isConfirmed", true);
                    window.location.href = "#!/list-Customer";
                });
            })
            .catch(function (errorResponse) {
                if (errorResponse.status === 400) {
                    const errorMassage = errorResponse.data.message;
                    Swal.fire({
                        icon: "error",
                        title: errorMassage + "",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
            });
    };

    //Return
    $scope.returnEdit = function () {
        window.location.href = "#!/list-Customer"
    };
});