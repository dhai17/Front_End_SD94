app.controller("StaffController", function ($scope, $http) {
    $http.get("http://localhost:8080/api/staff/list").then(function (response) {
        const promotions = response.data;
        $scope.promotions = promotions;
    });
//     // function getStatusText(status) {
//     //     if (status == 0) {
//     //         return "Active";
//     //     } else if (status == 1) {
//     //         return "Expired";
//     //     } else {
//     //         return "Awaiting";
//     //     }
//     // }
//     //Phân trang
//     $scope.pager = {
//         page: 1,
//         size: 8,
//         get promotions() {
//             if ($scope.promotions && $scope.promotions.length > 0) {
//                 let start = (this.page - 1) * this.size;
//                 return $scope.promotions.slice(start, start + this.size);
//             } else {
//                 // Trả về một mảng trống hoặc thông báo lỗi tùy theo trường hợp
//                 return [];
//             }
//         },
//         get count() {
//             if ($scope.promotions && $scope.promotions.length > 0) {
//                 let start = (this.page - 1) * this.size;
//                 return Math.ceil(1.0 * $scope.promotions.length / this.size);
//             } else {
//                 // Trả về 0
//                 return 0;
//             }
//         },
//         get pageNumbers() {
//             const pageCount = this.count;
//             const pageNumbers = [];
//             for (let i = 1; i <= pageCount; i++) {
//                 pageNumbers.push(i);
//             }
//             return pageNumbers;
//         }
//     };

//     function fomatMaxValue(dateOfBirth) {
//         return dateOfBirth.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
//     }

//     //Chuyển hướng đến trang edit theo id
//     $scope.editStaff = function (promotion) {
//         let idStaff = promotion.id;
//         window.location.href = '#!/edit-Staff?id=' + idStaff;
//     };

//      // Xóa trong danh sách
//      $scope.deleteStaff = function (promotion) {
//         let idStaff = promotion.id;
//         $http.put("http://localhost:8080/api/staff/deleteStaff=" + idStaff)
//             .then(function (response) {
//                 const promotions = response.data;
//                 promotions.forEach(function (promotion) {
//                 });

//                 // Cập nhật lại dữ liệu trong table nhưng không load lại trang
//                 $scope.$evalAsync(function () {
//                     $scope.promotions = promotions;
//                     Swal.fire({
//                         icon: "success",
//                         title: "Xóa thành công",
//                         showConfirmButton: false,
//                         timer: 2000,
//                     });
//                 });

//             })
//             .catch(function (error) {
//                 console.log("Error");
//             });
//     }

//      // Tìm kiếm
//     $scope.searchAllStaff = function (searchTerm) {
//         $http.get("http://localhost:8080/api/staff/search=" + searchTerm)
//             .then(function (response) {
//                 const promotions = response.data;
//                 promotions.forEach(function (promotion) {
//                 });

//                 // Cập nhật lại dữ liệu trong table nhưng không load lại trang by hduong25
//                 $scope.$evalAsync(function () {
//                     $scope.promotions = promotions;
//                 });
//             });
//     }

//     $scope.searchStaff = function (selectedDate) {
//         let formattedDate = formatDate(selectedDate);

//         // Tiếp tục với yêu cầu HTTP và xử lý dữ liệu
//         $http.get("http://localhost:8080/api/staff/searchDate=" + formattedDate)
//             .then(function (response) {
//                 const promotions = response.data;
//                 promotions.forEach(function (promotion) {
//                 });

//                 $scope.$evalAsync(function () {
//                     $scope.promotions = promotions;
//                 })
//             });
//     }
//     function formatDate(dateString) {
//         let date = new Date(dateString);
//         let year = date.getFullYear();
//         let month = ("0" + (date.getMonth() + 1)).slice(-2);
//         let day = ("0" + date.getDate()).slice(-2);
//         return year + "-" + month + "-" + day;
//     }
//     // Re load
//     $scope.reLoad = function () {
//         $http.get("http://localhost:8080/api/staff/list").then(function (response) {
//             const promotions = response.data;
//             promotions.forEach(function (promotion) {
//             });

//             $scope.$evalAsync(function () {
//                 $scope.promotions = promotions;
//             })
//         });
//     }
// });

// //----------------
// app.controller("CreateStaffController", function ($scope, $http) {
//     $scope.saveCreateStaff = function () {

//         if ($scope.createStaff === undefined) {
//             Swal.fire({
//                 icon: "error",
//                 title: "Vui lòng nhập đầy đủ thông tin",
//                 showConfirmButton: false,
//                 timer: 2000,
//             });
//             return;
//         }

//         $http.post("http://localhost:8080/api/staff/createStaff", $scope.createStaff)
//             .then(function (response) {
//                 // Xử lý thành công nếu có
//                 Swal.fire({
//                     icon: "success",
//                     title: "Thêm mới thành công",
//                     showConfirmButton: false,
//                     timer: 2000,
//                 }).then(function () {
//                     sessionStorage.setItem("isConfirmed", true);
//                     window.location.href = "#!/list-Staff";
//                 });
//             })
//             .catch(function (error) {
//                 if (error.status === 400) {
//                     const errorMessage = error.data.message;
//                     Swal.fire({
//                         icon: "error",
//                         title: errorMessage + "",
//                         showConfirmButton: false,
//                         timer: 2000,
//                     });
//                 } else {
//                     // Xử lý lỗi khác nếu cần
//                     console.error(error);
//                 }
//             });

//     };

//     $scope.returnCreate = function () {
//         window.location.href = "#!/list-Staff"
//     };
});

