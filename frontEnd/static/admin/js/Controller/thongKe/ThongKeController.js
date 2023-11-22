app.controller("thongKeController", function ($scope, $http) {

     let token = localStorage.getItem("token");
     let headers = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
     }

     $http.get("http://localhost:8080/thongKe/tongDoanhSo", { headers })
          .then(function (response) {
               $scope.tongDoanhSo = response.data;
               $scope.tongTien = 0;

               angular.forEach($scope.tongDoanhSo, function (item) {
                    $scope.tongTien += item.tong_tien_hoadon;
               });
          });
});