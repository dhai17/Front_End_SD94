app.controller("ColorrController", function ($scope, $http) {

    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    $http.get("http://localhost:8080/mauSac/danhSach", { headers })
        .then(function (response) {
            const promotions = response.data;
            $scope.promotions = promotions;
        });


    $scope.delete = function (promotion) {
        let idColor = promotion.id;
        $http.delete("http://localhost:8080/mauSac/xoa/" + idColor, { headers })
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

    $scope.editColor = function (promotion) {
        let idColor = promotion.id;
        window.location.href = '#!/edit-Color?id=' + idColor;
    };

    $scope.createColorr = function (promotion) {
        window.location.href = '#!/create-Color?id=';
    };

});

app.controller("CreateColorController", function ($scope, $http) {

    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    const colorPicker = new iro.ColorPicker("#colorPicker", {
        width: 280,
        color: "rgb(255, 0, 0)",
        borderWidth: 1,
        borderColor: "#fff",
    });

    const hexInput = document.getElementById("hexInput");

    colorPicker.on("color:change", function (color) {
        hexInput.value = color.hexString;
    });

    hexInput.addEventListener('change', function () {
        colorPicker.color.hexString = this.value;
    });

    $scope.saveCreateColor = function () {

        if ($scope.createColor === undefined) {
            Swal.fire({
                icon: "error",
                title: "Vui lòng nhập đầy đủ thông tin",
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        let data = {
            tenMauSac: $("#inputUsername").val(),
            maMauSac: $("#hexInput").val()
        }

        $http.post("http://localhost:8080/mauSac/themMoi", data, { headers })
            .then(function (response) {
                // Xử lý thành công nếu có
                Swal.fire({
                    icon: "success",
                    title: "Thêm mới thành công",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem("isConfirmed", true);
                    window.location.href = "#!/list-Color";
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
        window.location.href = "#!/list-Color"
    };

});


app.controller("EditColorController", function ($scope, $routeParams, $http) {
    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
    let idColor = $routeParams.id;

    const colorPicker = new iro.ColorPicker("#colorPicker", {
        width: 280,
        color: "rgb(255, 0, 0)",
        borderWidth: 1,
        borderColor: "#fff",
    });

    const hexInput = document.getElementById("hexInput");

    colorPicker.on("color:change", function (color) {
        hexInput.value = color.hexString;
    });

    hexInput.addEventListener('change', function () {
        colorPicker.color.hexString = this.value;
    });

    $http.get("http://localhost:8080/mauSac/chinhSua/" + idColor, { headers })
        .then(function (response) {
            let editColor = response.data;
            console.log(editColor);
            $scope.editColor = editColor;
        });


    $scope.saveEdits = function () {

        let editColor = {
            id: idColor,
            tenMauSac: $("#inputUsername").val(),
            maMauSac: $("#hexInput").val()
        };

        $http.put("http://localhost:8080/mauSac/luuChinhSua", editColor, { headers })
            .then(function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Sửa thành công",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem("isConfirmed", true);
                    window.location.href = "#!/list-Color";
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
        window.location.href = "#!/list-Color"
    };
});