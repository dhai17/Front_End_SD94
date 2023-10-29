app.controller("LineController", function ($scope, $http) {

    $http.get("http://localhost:8080/api/product/line/list")
        .then(function (response) {
            const promotions = response.data;
            $scope.promotions = promotions;
        });

    $scope.deleteLine = function (promotion) {
        let idLine = promotion.id;
        $http.put("http://localhost:8080/api/product/line/delete/" + idLine)
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

    $scope.editLine = function (promotion) {
        let idLine = promotion.id;
        window.location.href = '#!/edit-Line?id=' + idLine;
    };

    $scope.createLinee = function (promotion) {
        window.location.href = '#!/create-Line?id=';
    };

});

app.controller("CreateLineController", function ($scope, $http) {


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

        $http.post("http://localhost:8080/api/product/line/saveCreate", $scope.createLine)
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
    let idLine = $routeParams.id;

    $http.get("http://localhost:8080/api/product/line/edit=" + idLine)
        .then(function (response) {
            let editLine = response.data;
            $scope.editLine = editLine;
        });


    $scope.saveEdits = function () {

        let editLine = {
            id: idLine,
            name: $scope.editLine.name,
        };

        $http.put("http://localhost:8080/api/product/line/saveUpdate", editLine)
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