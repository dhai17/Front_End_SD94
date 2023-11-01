window.ImgController = function ($scope, $http) {

    $scope.setSelectedFile = function (element) {
        $scope.selectedFile = element.files[0];
    };


    $scope.listAnh = {};

    $scope.anh = {
        id: null,
        images: null,
    };

    $scope.setSelectedFile = function (element) {
        $scope.selectedFile = element.files[0];
    };

    $scope.addAnh = function (event) {
        event.preventDefault();
        var data = new FormData();
        data.append('file', $scope.selectedFile);
        data.append('requestData', angular.toJson($scope.anh));

        var config = {
            transformRequest: angular.identity,
            transformResponse: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        };

        var url = "http://localhost:8080/api/productImg/add";
        var promise1 = $http.post(url, data, config);
        promise1.then(function (response) {
            $scope.loadLaiBanPhim();
        },
        function errorCallback(response) {
            alert(response.data.errorMessage);
        });
    };

    $scope.getImageUrl = function (image) {
        return 'data:image/png;base64,' + image;
    };

    $scope.loadLaiAnh= function () {
        var url = "http://localhost:8080/api/productImg"; // Thay đổi URL API tương ứng
        $http.get(url).then(function (response) {
            $scope.listAnh = response.data;
        });
    };

    $scope.detailBanPhim = function (event, index) {
        event.preventDefault();
        $scope.index = index;
        var id = $scope.listAnh.content[index].id;
        var url = "http://localhost:8080/api/productImg/detail/" + id; // Thay đổi URL API tương ứng
        $http.get(url).then(function (response) {
            $scope.anh = response.data;
        });
    };

    // Gọi hàm loadLaiBanPhim để tải dữ liệu ban đầu
    $scope.loadLaiAnh();
};