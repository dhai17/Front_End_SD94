// var app = angular.module('myApp', ["ngRoute"]);
app.controller('loginCtrl', function ($scope, $http) {
    $scope.email = '';
    $scope.password = '';
    $scope.login = function () {

        let data = JSON.stringify({
            email: $scope.email,
            password: $scope.password
        });
        let config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        $http.post('http://localhost:8080/login', data, config)
            .then(function (response) {
                // handle success
                localStorage.setItem("token", response.data.token)
                let token = localStorage.getItem("token");
                console.log(token);
                window.location.href = "#!/list-Discount"
            }).catch(function (error) {
                // handle error  
                console.log(error);
            });
    }

    $scope.logout = function () {
        localStorage.removeItem("token")
        Swal.fire({
            icon: "success",
            title: "logout sccuessfully",
            showConfirmButton: false,
            timer: 2000,
        }).then(function () {
            window.location.href = "#!/login"
        });
    }
}); 
