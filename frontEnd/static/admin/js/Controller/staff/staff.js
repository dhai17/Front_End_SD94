app.controller("StaffController", function ($scope, $http) {
    $http.get("http://localhost:8080/api/staff/list").then(function (response) {
        const promotions = response.data;
        $scope.promotions = promotions;
    });
   

    // Phân trang
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
    $scope.editStaff = function (promotion) {
        let idStaff = promotion.id;
        window.location.href = '#!/edit-Staff?id=' + idStaff;
    };

//   // Xóa trong danh sách
$scope.deleteStaff = function (promotion) {

    let idStaff = promotion.id;

    // Hiển thị hộp thoại xác nhận trước khi xóa

    Swal.fire({
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc chắn muốn xóa nhân viên này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            $http.put("http://localhost:8080/api/staff/deleteStaff=" + idStaff)
                .then(function (response) {
                    const promotions = response.data;
                    promotions.forEach(function (promotion) {
                    });

                    // Cập nhật lại dữ liệu trong table nhưng không load lại trang by Tung_BE
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
}



     // Tìm kiếm
    $scope.searchAllStaff = function (searchTerm) {
        $http.get("http://localhost:8080/api/staff/search=" + searchTerm)
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

    $scope.searchStaff = function (selectedDate) {
        let formattedDate = formatDate(selectedDate);

        // Tiếp tục với yêu cầu HTTP và xử lý dữ liệu
        $http.get("http://localhost:8080/api/staff/searchDate=" + formattedDate)
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
//     // Re load
    $scope.reLoad = function () {
        $http.get("http://localhost:8080/api/staff/list").then(function (response) {
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
app.controller("CreateStaffController", function ($scope, $http) {
    $scope.saveCreateStaff = function () {

        if ($scope.createStaff === undefined) {
            Swal.fire({
                icon: "error",
                title: "Vui lòng nhập đầy đủ thông tin",
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }

        $http.post("http://localhost:8080/api/staff/createStaff", $scope.createStaff)
            .then(function (response) {
                // Xử lý thành công nếu có
                Swal.fire({
                    icon: "success",
                    title: "Thêm mới thành công",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem("isConfirmed", true);
                    window.location.href = "#!/list-Staff";
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
        window.location.href = "#!/list-Staff"
    };
});
//Edit Staff
app.controller("EditStaffController", function ($scope, $routeParams, $http) {
    let idStaff = $routeParams.id;
    $http.get("http://localhost:8080/api/staff/edit/staffID=" + idStaff)
    .then(function (response) {
        const editStaff = response.data;
        $scope.editStaff = editStaff;
        console.log(editStaff.gender);

        if (editStaff.gender === true) {
            document.getElementById('inlineRadio1').checked = true;
        } else if (editStaff.gender === false) {
            document.getElementById('inlineRadio2').checked = true;
        }

        // Gán giá trị cho trường nhập liệu ngày sinh
        document.getElementById('inputDateOfBirth').value = editStaff.dateOfBirth;
    });

    //Lưu edit
    $scope.saveEditStaff = function () {
        let editStaff = {
            id: idStaff,
            name: $scope.editStaff.name,
            phoneNumber: $scope.editStaff.phoneNumber,
            email: $scope.editStaff.email,
            dateOfBirth: $scope.editStaff.dateOfBirth,
            address: $scope.editStaff.address,
            gender: $scope.editStaff.gender,
            password: $scope.editStaff.password
        };

        $http.put("http://localhost:8080/api/staff/saveUpdate", editStaff)
            .then(function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Sửa thành công",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem("isConfirmed", true);
                    window.location.href = "#!/list-Staff";
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
        window.location.href = "#!/list-Staff"
    };
});





