app.controller("ColorrController", function ($scope, $http) {

    $http.get("http://localhost:8080/api/product/color/list")
        .then(function (response) {
            const promotions = response.data;
            $scope.promotions = promotions;
        });


    $scope.delete = function (promotion) {
        let idColor = promotion.id;
        $http.put("http://localhost:8080/api/product/color/delete/" + idColor)
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

app.controller("CreateColorController", function ($scope, $http) {

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
            color: $("#inputUsername").val(),
            code: $("#hexInput").val()
        }

        $http.post("http://localhost:8080/api/product/color/saveCreate", data)
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

});