

app.controller("StaffController", function ($scope, $http) {
    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    $http.get("http://localhost:8080/nhanVien/danhSach", { headers }).then(function (response) {
        const promotions = response.data;

        // Thêm trường status2 vào từng đối tượng promotion

        promotions.forEach(function (promotion) {
            promotion.status5 = getStatusText(promotion.status);

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
    }

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


    // function fomatMaxValue(maximumvalue) {
    //     return maximumvalue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    // }


    //Chuyển hướng đến trang edit theo id
    $scope.editStaff = function (promotion) {
        let idStaff = promotion.id;
        window.location.href = '#!/edit-Staff?id=' + idStaff;
    };

    //   // Xóa trong danh sách
    $scope.deleteStaff = function (promotion) {

        let idStaff = promotion.id;
        let data = {
            idStaff
        }

        // Hiển thị hộp thoại xác nhận trước khi xóa

        Swal.fire({
            title: 'Confirm Delete',
            text: 'Do you want to delete?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                $http.delete("http://localhost:8080/nhanVien/xoa/" + data, { headers })
                    .then(function (response) {
                        const promotions = response.data;
                        promotions.forEach(function (promotion) {
                        });

                        // Cập nhật lại dữ liệu trong table nhưng không load lại trang by Tung_BE
                        $scope.$evalAsync(function () {
                            $scope.promotions = promotions;
                            Swal.fire({
                                icon: "success",
                                title: "Deleted successfully",
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

    $scope.$watch('searchTerm', function (newVal) {
        if (newVal) {
            $http.get("http://localhost:8080/nhanVien/timKiem=" + newVal, { headers })
                .then(function (response) {
                    const promotions = response.data;
                    promotions.forEach(function (promotion) {
                    });
                    promotions.forEach(function (promotion) {
                        promotion.status5 = getStatusText(promotion.status);

                    });

                    // Cập nhật lại dữ liệu trong table nhưng không load lại trang by hduong25
                    $scope.$evalAsync(function () {
                        $scope.promotions = promotions;
                    });
                });
        } else {
            $http.get("http://localhost:8080/nhanVien/danhSach", { headers }).then(function (response) {
                const promotions = response.data;

                // Thêm trường status2 vào từng đối tượng promotion

                promotions.forEach(function (promotion) {
                    promotion.status5 = getStatusText(promotion.status);

                });

                $scope.promotions = promotions;

            });
        }
    });


    // Tìm kiếm
    $scope.searchAllStaff = function (searchTerm) {
        $http.get("http://localhost:8080/nhanVien/timKiem=" + searchTerm, { headers })
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
        $http.get("http://localhost:8080/nhanVien/timKiemNgay=" + formattedDate, { headers })
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
        $http.get("http://localhost:8080/nhanVien/danhSach", { headers }).then(function (response) {
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
    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
    $scope.saveCreateStaff = function () {
        console.log($scope.createStaff.gioiTinh);
        if ($scope.createStaff === undefined) {
            Swal.fire({
                icon: "error",
                title: "Please enter complete information",
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        $scope.saveCreateStaff = function () {
            let radioBtn1 = document.getElementById("inlineRadio1");
            let radioBtn2 = document.getElementById("inlineRadio2");
            let gioiTinh;

            if (radioBtn1.checked) {
                gioiTinh = true;
            } else if (radioBtn2.checked) {
                gioiTinh = false;
            }

            console.log(gioiTinh);

            let createStaff = {
                hoTen: $scope.createStaff.hoTen,
                soDienThoai: $scope.createStaff.soDienThoai,
                email: $scope.createStaff.email,
                ngaySinh: $scope.createStaff.ngaySinh,
                diaChi: $scope.createStaff.diaChi,
                gioiTinh: gioiTinh,
                matKhau:  $scope.createStaff.matKhau,
            };

            $http.post("http://localhost:8080/nhanVien/themMoi", createStaff, { headers })
                .then(function (response) {
                    // Xử lý thành công nếu có
                    Swal.fire({
                        icon: "success",
                        title: "Added successfully",
                        showConfirmButton: false,
                        timer: 2000,
                    }).then(function () {
                        sessionStorage.setItem("isConfirmed", true);
                        window.location.href = "#!/list-Staff";
                    });
                })
                .catch(function (error) {
                    if (error.status == 400) {
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



    };

    $scope.returnCreate = function () {
        window.location.href = "#!/list-Staff"
    };
});



//Edit Staff
app.controller("EditStaffController", function ($scope, $routeParams, $http) {
    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
    let idStaff = $routeParams.id;
    $http.get("http://localhost:8080/nhanVien/chinhSua/" + idStaff,{ headers })
        .then(function (response) {
            const editStaff = response.data;
            $scope.editStaff = editStaff;

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
        console.log($scope.editStaff.gender);


        $http.put("http://localhost:8080/nhanVien/luuChinhSua", editStaff,{ headers })
            .then(function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Edit success fully",
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





