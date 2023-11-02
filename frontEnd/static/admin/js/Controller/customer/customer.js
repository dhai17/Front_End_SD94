
app.controller("CustomerController", function ($scope, $http) {
    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    // $http({
    //     method: 'GET',
    //     url: "http://localhost:8080/api/customer/list",
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${token}`
    //     }
    // }).then(function (response) {
    //     const promotions = response.data;
    //     $scope.promotions = promotions;
    // }).catch(e => {
    //     console.log("e =><", e);
    // });
    $http.get("http://localhost:8080/api/customer/list", { headers }).then(function (response) {
        const promotions = response.data;
        $scope.promotions = promotions;
    }).catch(e => {
        console.log("e =><", e);
        Swal.fire({
            icon: "error",
            title: "Token inval",
            showConfirmButton: false,
            timer: 2000,
        }).then(function () {
            window.location.href = "#!/login"

            // sessionStorage.setItem("isConfirmed", true);
            // window.location.href = "#!/list-Customer";
        });
        // if()
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
        Swal.fire({
            title: 'Xác nhận xóa khách hàng',
            text: 'Bạn có chắc chắn muốn xóa khách hàng này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                $http.put("http://localhost:8080/api/customer/deleteCustomer=" + idCustomer, {}, { headers })
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

    // Tìm kiếm
    $scope.searchAllCustomer = function (searchTerm) {
        $http.get("http://localhost:8080/api/customer/search=" + searchTerm, { headers })
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
        $http.get("http://localhost:8080/api/customer/searchDate=" + formattedDate, { headers })
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
        $http.get("http://localhost:8080/api/customer/list", { headers }).then(function (response) {
            const promotions = response.data;
            promotions.forEach(function (promotion) {
            });

            $scope.$evalAsync(function () {
                $scope.promotions = promotions;
            })
        });
    }
});

// Create controller
app.controller("CreateCustomerController", function ($scope, $http) {
<<<<<<< HEAD
    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ' + token
    }
=======
    console.log("token ---->", token);
    Swal.fire({
        icon: "warning",
        title: "Bạn cần đăng nhập trước khi tiếp tục.",
        showConfirmButton: false,
        timer:2000,
    }).then(function() {
            // Người dùng chọn "Đăng nhập"
            window.location.href = "#!/login";
    });
>>>>>>> 6d98afde585d205ccbf985ad1110b51f96cb8696
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

        $http.post("http://localhost:8080/api/customer/createCustomer", $scope.createCustomer, { headers })
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

//Edit controller
app.controller("EditCustomerController", function ($scope, $routeParams, $http) {
    let idCustomer = $routeParams.id;
    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ' + token
    }

    $http.get("http://localhost:8080/api/customer/edit/customerID=" + idCustomer, { headers })
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

        $http.put("http://localhost:8080/api/customer/saveUpdate", editCustomer, { headers })
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