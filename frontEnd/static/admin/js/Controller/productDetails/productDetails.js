app.controller("ProductDetailsController", function ($scope, $http) {

    $http.get("http://localhost:8080/api/productDetails/list")
        .then(function (response) {
            const promotions = response.data;

            promotions.forEach(function (promotion) {
                promotion.status2 = getStatusText(promotion.status);
            });

            $scope.promotions = promotions;
        });

    function getStatusText(status) {
        if (status == 0) {
            return "Active";
        } else if (status == 1) {
            return "Expired";
        } else {
            return "Awaiting";
        }
    }

    //Phân trang
    $scope.pager = {
        page: 1,
        size: 8,
        get promotions() {
            if ($scope.promotions && $scope.promotions.length > 0) {
                let start = (this.page - 1) * this.size;
                return $scope.promotions.slice(start, start + this.size);
            } else {
                // Trả về một mảng trống hoặc thông báo lỗi tùy theo trường hợp
                return [];
            }
        },
        get count() {
            if ($scope.promotions && $scope.promotions.length > 0) {
                let start = (this.page - 1) * this.size;
                return Math.ceil(1.0 * $scope.promotions.length / this.size);
            } else {
                // Trả về 0
                return 0;
            }
        },
        get pageNumbers() {
            const pageCount = this.count;
            const pageNumbers = [];
            for (let i = 1; i <= pageCount; i++) {
                pageNumbers.push(i);
            }
            return pageNumbers;
        }
    };



    //Chuyển hướng đến trang edit theo id
    $scope.edit = function (promotion) {
        let idProDetails = promotion.id;
        window.location.href = '#!/edit-ProductDetails?id=' + idProDetails;
    };

    //Xóa trong danh sách
    $scope.delete = function (promotion) {
        let idProDetails = promotion.id;
        console.log(idProDetails)
        $http.delete("http://localhost:8080/api/productDetails/deleteprodtuctDetails/" + idProDetails)
            .then(function (response) {
                const promotions = response.data;

                // Thêm trường status2 và fomatMaximumValue vào từng đối tượng promotion
                promotions.forEach(function (promotion) {
                    promotion.status2 = getStatusText(promotion.status);
                });

                // Cập nhật lại dữ liệu trong table nhưng không load lại trang by SD_94
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

    //Tìm kiếm
    $scope.search = function (searchTerm) {
        $http.get("http://localhost:8080/api/productDetails/search=" + searchTerm)
            .then(function (response) {
                const promotions = response.data;
                promotions.forEach(function (promotion) {
                    promotion.status2 = getStatusText(promotion.status);
                });

                // Cập nhật lại dữ liệu trong table nhưng không load lại trang by hduong25
                $scope.$evalAsync(function () {
                    $scope.promotions = promotions;
                });
            });
    }

    //Tìm kiếm ngày bắt đầu
    $scope.searchDate = function (selectedDate) {
        let formattedDate = formatDate(selectedDate);

        // Tiếp tục với yêu cầu HTTP và xử lý dữ liệu
        $http.get("http://localhost:8080/api/productDetails/searchDate=" + formattedDate)
            .then(function (response) {
                const promotions = response.data;
                promotions.forEach(function (promotion) {
                    promotion.status2 = getStatusText(promotion.status);
                });

                $scope.$evalAsync(function () {
                    $scope.promotions = promotions;
                })
            });
    }

    function formatDate(dateString) {
        let date = new Date(dateString);
        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);
        return year + "-" + month + "-" + day;
    }

    // Re load
    $scope.reLoad = function () {
        $http.get("http://localhost:8080/api/productDetails/list").then(function (response) {
            const promotions = response.data;
            promotions.forEach(function (promotion) {
                promotion.status2 = getStatusText(promotion.status);
            });

            $scope.$evalAsync(function () {
                $scope.promotions = promotions;
            })
        });
    }
});

//Edit controller
app.controller("EditProductDetailsController", function ($scope, $routeParams, $http) {
    let idProDetails = $routeParams.id;

    $http.get("http://localhost:8080/api/productDetails/edit/prodtuctDetailsID=" + idProDetails)
        .then(function (response) {
            const editproductDetails = response.data;
            $scope.editproductDetails = editproductDetails;
        });


    //Lưu edit
    $scope.saveEdit = function () {
        let maxValue = $scope.editproductDetails.fomatMaximumValue;
        let numericValue = parseFloat(maxValue.replace(/[^\d.-]/g, ''));

        let editproductDetails = {
            id: idProDetails,
            name: $scope.editproductDetails.name,
            startedDate: $scope.editproductDetails.startedDate,
            endDate: $scope.editproductDetails.endDate,
            percentproductDetails: $scope.editproductDetails.percentproductDetails,
        };

        $http.put("http://localhost:8080/api/productDetails/saveUpdate", editproductDetails)
            .then(function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Sửa thành công",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem("isConfirmed", true);
                    window.location.href = "#!/list-productDetails";
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
        window.location.href = "#!/list-ProductDetails"
    };
});

// Create controller
app.controller("CreateProductDetailsController", function ($scope, $http) {
    
    let selectedColorId;
    $scope.getIdColor = function () {

        for (let i = 0; i < $scope.color.length; i++) {
            if ($scope.selectedColor == $scope.color[i].id) {
                selectedColorId = $scope.color[i].id;
                break;
            }
        }
        console.log("Selected color ID: " + selectedColorId);
    };

    $scope.saveCreate = function () {
        
        // if ($scope.create === undefined) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Vui lòng nhập đầy đủ thông tin",
        //         showConfirmButton: false,
        //         timer: 2000,
        //     });
        //     return;
        // }

        $http.post("http://localhost:8080/api/productDetails/saveCreate/" + selectedColorId)

            .then(function (response) {
                console.log(selectedColorId + "sakjhdasu");
                // Xử lý thành công nếu có
                Swal.fire({
                    icon: "success",
                    title: "Thêm mới thành công",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem("isConfirmed", true);
                    window.location.href = "#!/list-ProductDetails";
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
                    // Xử lý lỗi khác nếu cần
                    console.error(error);
                }
            });

    };


    $scope.saveS = function () {
        var object = $scope.create;
        console.log(object)
        $http.post("http://localhost:8080/api/productDetails/saveCreate",object)

            .then(function (response) {
                // Xử lý thành công nếu có
                Swal.fire({
                    icon: "success",
                    title: "Thêm mới thành công",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem("isConfirmed", true);
                    window.location.href = "#!/list-ProductDetails";
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
                    // Xử lý lỗi khác nếu cần
                    console.error(error);
                }
            });
    }

    $http.get("http://localhost:8080/api/product/color/list")
        .then(function (response) {
            const color = response.data;
            $scope.color = color;
        })

    $http.get("http://localhost:8080/api/product/size/list")
        .then(function (response) {
            const size = response.data;
            $scope.size = size;
        })

    $scope.returnCreate = function () {
        window.location.href = "#!/list-ProductDetails"
    };
});



// app.controller("CreateProductController", function ($scope, $http, $routeParams) {

//     let idPro = $routeParams.id;

//     $scope.saveCreate = function () {
//         let createProduct = {
//             id: idPro,
//             name: $scope.createProduct.name,
//             price: $scope.createProduct.price,
//             origin: $scope.createProduct.origin,
//             productMaterial: {
//                 id: $scope.createProduct.productMaterial
//             },
//             productLine: {
//                 id: $scope.createProduct.productLine
//             },
//             producer: {
//                 id: $scope.createProduct.producer
//             }
//         };

//         $http.post("http://localhost:8080/api/product/saveCreate", createProduct)
//             .then(function (response) {
//                 Swal.fire({
//                     icon: "success",
//                     title: "Lưu thành công",
//                     showConfirmButton: false,
//                     timer: 2000,
//                 }).then(function () {
//                     sessionStorage.setItem("isConfirmed", true);
//                     window.location.href = "#!/list-productDetails";
//                 });
//             })
//             .catch(function (errorResponse) {
//                 if (errorResponse.status === 400) {
//                     const errorMessage = errorResponse.data.message;
//                     Swal.fire({
//                         icon: "error",
//                         title: errorMessage + "",
//                         showConfirmButton: false,
//                         timer: 2000,
//                     });
//                 }
//             });
//     };

//     $http.get("http://localhost:8080/api/product/material/list")
//         .then(function (response) {
//             const material = response.data;
//             $scope.material = material;
//         })

//     $http.get("http://localhost:8080/api/product/line/list")
//         .then(function (response) {
//             const line = response.data;
//             $scope.line = line;
//         })

//     $http.get("http://localhost:8080/api/product/producer/list")
//         .then(function (response) {
//             const producer = response.data;
//             $scope.producer = producer;
//         })

//     $scope.returnCreate = function () {
//         window.location.href = "#!/list-Product"
//     };
// });




