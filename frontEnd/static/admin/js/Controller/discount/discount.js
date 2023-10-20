app.controller("DiscountController", function ($scope, $http) {
    $http.get("http://localhost:8080/api/discount/list").then(function (response) {
        const promotions = response.data;

        // Thêm trường status2 vào từng đối tượng promotion
        promotions.forEach(function (promotion) {
            promotion.status2 = getStatusText(promotion.status);
            promotion.fomatMaximumValue = fomatMaxValue(promotion.maximumvalue);
        });

        $scope.promotions = promotions;
    });

    // $http.get("http://localhost:3000/api/v1/discount/").then(function (response) {
    //     const promotions = response.data;

    //     // Thêm trường status2 vào từng đối tượng promotion
    //     promotions.forEach(function (promotion) {
    //         promotion.status2 = getStatusText(promotion.status);
    //         promotion.fomatMaximumValue = fomatMaxValue(promotion.maximumvalue);
    //     });

    //     $scope.promotions = promotions;
    //     console.log(promotions);
    // }).catch(e => {
    //     console.log(e);
    //     Swal.fire({
    //         icon: "error",
    //         title: "System error",
    //         showConfirmButton: false,
    //         timer: 2000,
    //     });
    // });

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
        size: 5,
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


    function fomatMaxValue(maximumvalue) {
        return maximumvalue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    //Chuyển hướng đến trang edit theo id
    $scope.editDiscount = function (promotion) {
        let idDiscount = promotion.id;
        window.location.href = '#!/edit-Discount?id=' + idDiscount;
    };

    //Xóa trong danh sách
    $scope.deleteDiscount = function (promotion) {
        let idDiscount = promotion.id;
        $http.put("http://localhost:8080/api/discount/deleteDiscount=" + idDiscount)
            .then(function (response) {
                const promotions = response.data;

                // Thêm trường status2 và fomatMaximumValue vào từng đối tượng promotion
                promotions.forEach(function (promotion) {
                    promotion.status2 = getStatusText(promotion.status);
                    promotion.fomatMaximumValue = fomatMaxValue(promotion.maximumvalue);
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

    //Tìm kiếm
    $scope.searchDiscount = function (searchTerm) {
        $http.get("http://localhost:8080/api/discount/search=" + searchTerm)
            .then(function (response) {
                const promotions = response.data;
                promotions.forEach(function (promotion) {
                    promotion.status2 = getStatusText(promotion.status);
                    promotion.fomatMaximumValue = fomatMaxValue(promotion.maximumvalue);
                });

                // Cập nhật lại dữ liệu trong table nhưng không load lại trang by hduong25
                $scope.$evalAsync(function () {
                    $scope.promotions = promotions;
                });
            });
    }

    //Tìm kiếm ngày bắt đầu
    $scope.searchDateDiscount = function (selectedDate) {
        let formattedDate = formatDate(selectedDate);

        // Tiếp tục với yêu cầu HTTP và xử lý dữ liệu
        $http.get("http://localhost:8080/api/discount/searchDate=" + formattedDate)
            .then(function (response) {
                const promotions = response.data;
                promotions.forEach(function (promotion) {
                    promotion.status2 = getStatusText(promotion.status);
                    promotion.fomatMaximumValue = fomatMaxValue(promotion.maximumvalue);
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

    //Re load
    $scope.reLoad = function () {
        $http.get("http://localhost:8080/api/discount/list").then(function (response) {
            const promotions = response.data;
            promotions.forEach(function (promotion) {
                promotion.status2 = getStatusText(promotion.status);
                promotion.fomatMaximumValue = fomatMaxValue(promotion.maximumvalue);
            });

            $scope.$evalAsync(function () {
                $scope.promotions = promotions;
            })
        });
    }
});

//Edit controller
app.controller("EditDiscountController", function ($scope, $routeParams, $http) {
    let idDiscount = $routeParams.id;

    $http.get("http://localhost:8080/api/discount/edit/discountID=" + idDiscount)
        .then(function (response) {
            const editDiscount = response.data;
            editDiscount.fomatMaximumValue = fomatMaxValue(editDiscount.maximumvalue);
            $scope.editDiscount = editDiscount;
        });

    function fomatMaxValue(maximumvalue) {
        return maximumvalue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    //Lưu edit
    $scope.saveEditDiscount = function () {
        let maxValue = $scope.editDiscount.fomatMaximumValue;
        let numericValue = parseFloat(maxValue.replace(/[^\d.-]/g, ''));

        let editDiscount = {
            id: idDiscount,
            name: $scope.editDiscount.name,
            startedDate: $scope.editDiscount.startedDate,
            endDate: $scope.editDiscount.endDate,
            percentDiscount: $scope.editDiscount.percentDiscount,
            maximumvalue: numericValue
        };

        $http.put("http://localhost:8080/api/discount/saveUpdate", editDiscount)
            .then(function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Sửa thành công",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem("isConfirmed", true);
                    window.location.href = "#!/list-Discount";
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
        window.location.href = "#!/list-Discount"
    };
});

//Create controller
app.controller("CreateDiscountController", function ($scope, $http) {
    $scope.saveCreateDiscount = function () {

        if ($scope.createDiscount === undefined) {
            Swal.fire({
                icon: "error",
                title: "Vui lòng nhập đầy đủ thông tin",
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }

        $http.post("http://localhost:8080/api/discount/saveCreate", $scope.createDiscount)
            .then(function (response) {
                // Xử lý thành công nếu có
                Swal.fire({
                    icon: "success",
                    title: "Thêm mới thành công",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem("isConfirmed", true);
                    window.location.href = "#!/list-Discount";
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
        window.location.href = "#!/list-Discount"
    };
});




