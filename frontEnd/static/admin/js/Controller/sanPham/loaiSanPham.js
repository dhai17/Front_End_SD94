app.controller("LineController", function ($scope, $http) {

    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    $http.get("http://localhost:8080/loaiSanPham/danhSach", { headers })
        .then(function (response) {
            const promotions = response.data;
            $scope.promotions = promotions;
        });

    $scope.deleteLine = function (promotion) {
        let idLine = promotion.id;
        Swal.fire({
            title: 'Xác nhận xóa sản phẩm',
            text: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                $http.delete("http://localhost:8080/loaiSanPham/xoa/" + idLine, { headers })
                    .then(function (response) {
                        const promotions = response.data;
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

    $scope.editLine = function (promotion) {
        let idLine = promotion.id;
        window.location.href = '#!/edit-Line?id=' + idLine;
    };

    $scope.createLinee = function (promotion) {
        window.location.href = '#!/create-Line?id=';
    };

});

app.controller("CreateLineController", function ($scope, $http) {

    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    $scope.saveCreate = function () {

        if ($scope.createLine === undefined) {
            Swal.fire({
                icon: "error",
                title: "Vui lòng nhập đầy đủ thông tin",
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }

        $http.post("http://localhost:8080/loaiSanPham/themMoi", $scope.createLine, { headers })
            .then(function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Thêm mới thành công",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem("isConfirmed", true);
                    window.location.href = "#!/list-Line";
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
                    console.error(error);
                }
            });
    };

    $scope.returnCreate = function () {
        window.location.href = "#!/list-Line"
    };

});


//
app.controller("EditLineController", function ($scope, $routeParams, $http) {

    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
    let idLine = $routeParams.id;

    $http.get("http://localhost:8080/loaiSanPham/chinhSua/" + idLine, { headers })
        .then(function (response) {
            let editLine = response.data;
            $scope.editLine = editLine;
        });


    $scope.saveEdits = function () {

        let editLine = {
            id: idLine,
            loaiSanPham: $scope.editLine.loaiSanPham,
        };

        $http.put("http://localhost:8080/loaiSanPham/luuChinhSua", editLine, { headers })
            .then(function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Sửa thành công",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem("isConfirmed", true);
                    window.location.href = "#!/list-Line";
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
        window.location.href = "#!/list-Line"
    };
});