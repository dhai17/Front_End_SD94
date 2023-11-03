app.controller('LoginController', function ($scope, $http) {
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
        console.log(config);
        $http.post('http://localhost:8080/login', data, config)
            .then(function (response) {
                // handle success
                localStorage.setItem("token", response.data.token)
                let token = localStorage.getItem("token");
                window.location.href = "http://127.0.0.1:5501/templates/admin/home/index.html#!/";
            }).catch(function (error) {
                // handle error  
                console.log(error);
            });
    }
}); 
