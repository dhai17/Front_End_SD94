app.controller("MaterialController", function ($scope, $http) {

    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    $http.get("http://localhost:8080/chatLieu/danhSach", { headers })
        .then(function (response) {
            const promotions = response.data;
            $scope.promotions = promotions;
        });

    $scope.deleteMaterial = function (promotion) {
        let idMaterial = promotion.id;
        $http.delete("http://localhost:8080/chatLieu/xoa/" + idMaterial, { headers })
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

    $scope.editMaterial = function (promotion) {
        let idMaterial = promotion.id;
        window.location.href = '#!/edit-Material?id=' + idMaterial;
    };

    $scope.createMateriall = function (promotion) {
        window.location.href = '#!/create-Material?id=';
    };

});

app.controller("CreateMaterialController", function ($scope, $http) {

    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    $scope.saveCreate = function () {

        if ($scope.createMaterial === undefined) {
            Swal.fire({
                icon: "error",
                title: "Vui lòng nhập đầy đủ thông tin",
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }

        $http.post("http://localhost:8080/chatLieu/themMoi", $scope.createMaterial, { headers })
            .then(function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Thêm mới thành công",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem("isConfirmed", true);
                    window.location.href = "#!/list-Material";
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
        window.location.href = "#!/list-Material"
    };

});


//
app.controller("EditMaterialController", function ($scope, $routeParams, $http) {
    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
    let idMaterial = $routeParams.id;

    $http.get("http://localhost:8080/chatLieu/chinhSua/" + idMaterial, { headers })
        .then(function (response) {
            let editMaterial = response.data;
            $scope.editMaterial = editMaterial;
        });


    $scope.saveEdits = function () {

        let editMaterial = {
            id: idMaterial,
            chatLieu: $scope.editMaterial.chatLieu,
        };

        $http.put("http://localhost:8080/chatLieu/luuChinhSua", editMaterial, { headers })
            .then(function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Sửa thành công",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem("isConfirmed", true);
                    window.location.href = "#!/list-Material";
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
        window.location.href = "#!/list-Material"
    };
});