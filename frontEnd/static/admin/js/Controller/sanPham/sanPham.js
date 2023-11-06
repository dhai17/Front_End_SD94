app.controller("ProductController", function ($scope, $http) {

    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    $http.get("http://localhost:8080/sanPham/danhSach", { headers })
        .then(function (response) {
            const promotions = response.data;
            promotions.forEach(function (promotion) {
                promotion.status2 = getStatusText(promotion.trangThai);
            });
            $scope.promotions = promotions;
        });


    function getStatusText(trangThai) {
        if (trangThai == 0) {
            return "Còn hàng";
        } else if (trangThai == 1) {
            return "Hết hàng";
        } else {
            return "Lưu kho";
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
                return [];
            }
        },
        get count() {
            if ($scope.promotions && $scope.promotions.length > 0) {
                let start = (this.page - 1) * this.size;
                return Math.ceil(1.0 * $scope.promotions.length / this.size);
            } else {
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
        let idPro = promotion.id;
        window.location.href = '#!/edit-Product?id=' + idPro;
    };

    $scope.create = function (promotion) {
        window.location.href = '#!/create-Product?id=';
    };

    //Xóa trong danh sách
    $scope.delete = function (promotion) {
        let idPro = promotion.id;
        $http.delete("http://localhost:8080/sanPham/xoa/" + idPro, { headers })
            .then(function (response) {
                const promotions = response.data;

                promotions.forEach(function (promotion) {
                    promotion.status2 = getStatusText(promotion.trangThai);
                });

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

    // Re load
    $scope.reLoad = function () {
        $http.get("http://localhost:8080/api/product/list", { headers })
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
});

//Edit controller
app.controller("EditProductController", function ($scope, $routeParams, $http) {

    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    $http.get("http://localhost:8080/api/product/material/list", { headers })
        .then(function (response) {
            const material = response.data;
            $scope.material = material;
        })

    $http.get("http://localhost:8080/api/product/line/list", { headers })
        .then(function (response) {
            const line = response.data;
            $scope.line = line;
        })

    $http.get("http://localhost:8080/api/product/producer/list", { headers })
        .then(function (response) {
            const producer = response.data;
            $scope.producer = producer;
        })

    $http.get("http://localhost:8080/api/product/color/list", { headers })
        .then(function (response) {
            const color = response.data;
            $scope.color = color;
        })

    $http.get("http://localhost:8080/api/product/size/list", { headers })
        .then(function (response) {
            const size = response.data;
            $scope.size = size;
        })

    // let idPro = $routeParams.id;

    let id_color = [];
    $scope.getIdColor = function (color) {
        if (id_color.indexOf(color.id) === -1) {
            id_color.push(color.id);
        } else {
            console.log("ID already exists in the array");
        }
    };

    let selectedSizeId;
    let id_size = [];
    $scope.getIdSize = function (size) {
        if (id_size.indexOf(size.id) === -1) {
            id_size.push(size.id);
        } else {
            console.log("ID already exists in the array");
        }
    };

    let idPro = $routeParams.id;

    $http.get("http://localhost:8080/api/product/edit=" + idPro, { headers })
        .then(function (response) {
            const editproduct = response.data;
            $scope.editproduct = editproduct;
        });

    $scope.saveEdits = function () {

        let editProduct = {
            id: idProduct,
            name: $scope.createProduct.name,
            price: $scope.createProduct.price,
            origin: $scope.createProduct.origin,
            id_metarial: $scope.createProduct.productMaterial,
            id_line: $scope.createProduct.productLine,
            producer: $scope.createProduct.producer,
            color: id_color,
            size: id_size,
            quantity: $scope.createProduct.quantity,
            status: $scope.createProduct.status,
        };

        $http.put("http://localhost:8080/api/product/saveUpdate", editProduct, { headers })
            .then(function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Sửa thành công",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem("isConfirmed", true);
                    window.location.href = "#!/list-Product";
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
        window.location.href = "#!/list-Product"
    };

});

//Create controller
app.controller("CreateProductController", function ($scope, $http, $routeParams) {
    let token = localStorage.getItem("token");
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    $http.get("http://localhost:8080/chatLieu/danhSach", { headers })
        .then(function (response) {
            const chatLieu = response.data;
            $scope.chatLieu = chatLieu;
        })

    $http.get("http://localhost:8080/loaiSanPham/danhSach", { headers })
        .then(function (response) {
            const loaiSanPham = response.data;
            $scope.loaiSanPham = loaiSanPham;
        })

    $http.get("http://localhost:8080/nhaSanXuat/danhSach", { headers })
        .then(function (response) {
            const nhaSanXuat = response.data;
            $scope.nhaSanXuat = nhaSanXuat;
        })

    $http.get("http://localhost:8080/mauSac/danhSach", { headers })
        .then(function (response) {
            const mauSac = response.data;
            $scope.mauSac = mauSac;
        })

    $http.get("http://localhost:8080/kichCo/danhSach", { headers })
        .then(function (response) {
            const kichCo = response.data;
            $scope.kichCo = kichCo;
        })


    let mauSac_id = [];
    $scope.getIdColor = function (mauSac) {
        if (mauSac_id.indexOf(mauSac.id) === -1) {
            mauSac_id.push(mauSac.id);
<<<<<<< HEAD
=======
        } else {
            console.log("ID already exists in the array");
>>>>>>> 541b7d248dd3f3d714a8b57be0c15dd6bc7b2a5d
        }
    };

    let kichCo_id = [];
    $scope.getIdSize = function (kichCo) {
        if (kichCo_id.indexOf(kichCo.id) === -1) {
            kichCo_id.push(kichCo.id);
<<<<<<< HEAD
=======
        } else {
            console.log("ID already exists in the array");
>>>>>>> 541b7d248dd3f3d714a8b57be0c15dd6bc7b2a5d
        }
    };


    $scope.saveCreate = function () {

<<<<<<< HEAD
=======
        let createProduct = {
            id: idPro,
            tenSanPham: $scope.createProduct.tenSanPham,
            gia: $scope.createProduct.gia,
            chatLieu: {
                id: $scope.createProduct.chatLieu
            },
            loaiSanPham: {
                id: $scope.createProduct.loaiSanPham
            },
            nhaSanXuat: {
                id: $scope.createProduct.nhaSanXuat
            },
        };

>>>>>>> 541b7d248dd3f3d714a8b57be0c15dd6bc7b2a5d
        let data = {
            tenSanPham: $scope.createProduct.tenSanPham,
            gia: $scope.createProduct.gia,
            chatLieu_id: $scope.createProduct.chatLieu,
            loaiSanPham_id: $scope.createProduct.loaiSanPham,
            nhaSanXuat_id: $scope.createProduct.nhaSanXuat,
            mauSac: mauSac_id,
            kichCo: kichCo_id,
            soLuong: $scope.createProduct.soLuong,
<<<<<<< HEAD
        }


=======
            // trangThai: $scope.createProduct.trangThai,
        }

>>>>>>> 541b7d248dd3f3d714a8b57be0c15dd6bc7b2a5d
        $http.post("http://localhost:8080/sanPham/TaoSanPham", data, { headers })
            .then(function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Thêm mới thành công",
                    showConfirmButton: false,
                    timer: 2000,
                });
                const details = response.data;
                $scope.details = details;
            })
            .catch(function (response) {
                if (errorResponse.status === 400) {
                    const errorMessage = errorResponse.data.message;
                    Swal.fire({
                        icon: "error",
                        title: errorMessage + "",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
            })

        $scope.deleteCTSP = function (promotion) {
            let idPro = promotion.id;
            $http.delete("http://localhost:8080/sanPham/xoa-san-pham-chi-tiet/" + idPro, { headers })
                .then(function (response) {
                    const details = response.data;
                    $scope.$evalAsync(function () {
                        $scope.details = details;
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


    };

    $scope.returnCreate = function () {
        window.location.href = "#!/list-Product"
    };

    $scope.updateImg = function (promotion) {
        window.location.href = '#!/list-Img';
    };
});

app.controller('ImgController', function ($scope, $http) {

    const id = $routeParams.id;

    $http.get("http://localhost:8080/api/getColor", { params: { product_id: id } }, { headers })
        .then(function (response) {
            const color = response.data;
            $scope.color = color;
        });

    $http.get("http://localhost:8080/api/productDetails/edit/prodtuctDetailsID=" + id, { headers })
        .then(function (response) {
            const promotion = response.data;
            $scope.promotion = promotion;
        });

    $scope.uploadImage = function () {
        var formData = new FormData();
        formData.append('file', $scope.image);

        $http.post('/api/products/' + $scope.productId + '/uploadImage', formData, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function (response) {
            // Xử lý thành công
            console.log(response.data);
        }, function (error) {
            // Xử lý lỗi
            console.error(error);
        });
    };

    $scope.loadImage = function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $scope.$apply(function () {
                    $scope.imagePreview = e.target.result;
                });
            };
            reader.readAsDataURL(input.files[0]);
        }
    };
});
