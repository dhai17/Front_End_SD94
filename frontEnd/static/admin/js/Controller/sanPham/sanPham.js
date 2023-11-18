app.controller("ProductController", function ($scope, $http) {
    let token = localStorage.getItem("token");
    let headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
    };

    $http.get("http://localhost:8080/sanPham/danhSach", { headers })
        .then(function (response) {
            const promotions = response.data;
            promotions.forEach(function (promotion) {
                promotion.status2 = getStatusText(promotion.trangThai);
            });
            const imageRequests = promotions.map(function (promotion) {
                return $http.get("http://localhost:8080/sanPhamChiTiet/getdefaultimage?idsp=" + promotion.id, { headers })
                    .then(function (imageResponse) {
                        const imageData = imageResponse.data;
                        promotion.urlImage = imageData.tenAnh;
                    });
            });
            return Promise.all(imageRequests)
                .then(function () {
                    console.log(promotions);
                    $scope.promotions = promotions;
                });
        })
        .catch(function (error) {
            console.error("Error fetching promotions:", error);
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
        size: 5,
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
                return Math.ceil((1.0 * $scope.promotions.length) / this.size);
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
        },
    };

    $scope.dsCTSP = function (promotion) {
        let idSPCT = promotion.id;
        window.location.href = "#!/list-CTSP?id=" + idSPCT;
    };

    $scope.create = function (promotion) {
        window.location.href = "#!/create-Product?id=";
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

                const imageRequests = promotions.map(function (promotion) {
                    return $http.get("http://localhost:8080/sanPhamChiTiet/getdefaultimage?idsp=" + promotion.id, { headers })
                        .then(function (imageResponse) {
                            const imageData = imageResponse.data;
                            promotion.urlImage = imageData.tenAnh;
                        });
                });

                return Promise.all(imageRequests)
                    .then(function () {
                        $scope.$evalAsync(function () {
                            $scope.promotions = promotions;
                            Swal.fire({
                                icon: "success",
                                title: "Xóa thành công",
                                showConfirmButton: false,
                                timer: 2000,
                            });
                        });
                    });

            })
            .catch(function (error) {
                console.log("Error", error);
            });
    }

    // Re load
    $scope.reLoad = function () {
        $http
            .get("http://localhost:8080/api/product/list", { headers })
            .then(function (response) {
                const promotions = response.data;
                promotions.forEach(function (promotion) {
                    promotion.status2 = getStatusText(promotion.status);
                });

                $scope.$evalAsync(function () {
                    $scope.promotions = promotions;
                });
            });
    };
});

//Edit controller
app.controller("EditProductController", function ($scope, $routeParams, $http) {
    let token = localStorage.getItem("token");
    let headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
    };

    $http
        .get("http://localhost:8080/mauSac/danhSach", { headers })
        .then(function (response) {
            const mauSac = response.data;
            $scope.mauSac = mauSac;
        });

    $http
        .get("http://localhost:8080/kichCo/danhSach", { headers })
        .then(function (response) {
            const kichCo = response.data;
            $scope.kichCo = kichCo;
        });

    let idPro = $routeParams.id;

    $http
        .get("http://localhost:8080/sanPhamChiTiet/chinhSua/" + idPro, { headers })
        .then(function (response) {
            const editproduct = response.data;
            $scope.editproduct = editproduct;
        });

    $scope.saveEdits = function () {
        let idProduct = $routeParams.id;
        let editProduct = {
            id: idProduct,
            mauSac_id: $scope.editproduct.mauSac,
            kichCo_id: $scope.editproduct.kichCo,
            sanPham: $scope.editproduct.sanPham,
            soLuong: $scope.editproduct.soLuong,
        };

        $http
            .put("http://localhost:8080/sanPhamChiTiet/luuChinhSua", editProduct, {
                headers,
            })
            .then(function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Cập nhật thành công",
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
        window.location.href = "#!/list-Product";
    };
});

//Create controller
app.controller(
    "CreateProductController",
    function ($scope, $http, $routeParams) {
        let token = localStorage.getItem("token");
        let headers = {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        };

        $http
            .get("http://localhost:8080/chatLieu/danhSach", { headers })
            .then(function (response) {
                const chatLieu = response.data;
                $scope.chatLieu = chatLieu;
            });

        $http
            .get("http://localhost:8080/loaiSanPham/danhSach", { headers })
            .then(function (response) {
                const loaiSanPham = response.data;
                $scope.loaiSanPham = loaiSanPham;
            });

        $http
            .get("http://localhost:8080/nhaSanXuat/danhSach", { headers })
            .then(function (response) {
                const nhaSanXuat = response.data;
                $scope.nhaSanXuat = nhaSanXuat;
            });

        $http
            .get("http://localhost:8080/mauSac/danhSach", { headers })
            .then(function (response) {
                const mauSac = response.data;
                $scope.mauSac = mauSac;
            });

        $http
            .get("http://localhost:8080/kichCo/danhSach", { headers })
            .then(function (response) {
                const kichCo = response.data;
                $scope.kichCo = kichCo;
            });

        let mauSac_id = [];
        $scope.mauSacDaChon = "";
        $scope.onColorChange = function () {
            let mauSac = JSON.parse($scope.selectedColor);

            if (mauSac_id.indexOf(mauSac.id) === -1) {
                mauSac_id.push(mauSac.id);
                $scope.mauSacDaChon += mauSac.tenMauSac + ", ";
            }
        };

        let kichCo_id = [];
        $scope.kichCocDaChon = "";
        $scope.onKichCoChange = function () {
            let kichCo = JSON.parse($scope.selectedSizes);

            if (kichCo_id.indexOf(kichCo.id) === -1) {
                kichCo_id.push(kichCo.id);
                $scope.kichCocDaChon += kichCo.kichCo + ", ";
            }
        };

        $scope.saveCreate = function () {
            let data = {
                tenSanPham: $scope.createProduct.tenSanPham,
                gia: $scope.createProduct.gia,
                chatLieu_id: $scope.createProduct.chatLieu,
                loaiSanPham_id: $scope.createProduct.loaiSanPham,
                nhaSanXuat_id: $scope.createProduct.nhaSanXuat,
                mauSac: mauSac_id,
                kichCo: kichCo_id,
                soLuong: $scope.createProduct.soLuong,
            };

            $http
                .post("http://localhost:8080/sanPham/TaoSanPham", data, { headers })
                .then(function (response) {
                    Swal.fire({
                        icon: "success",
                        title: "Thêm mới thành công",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    const details = response.data.list;
                    $scope.details = details;

                    localStorage.setItem("id_product", response.data.id_product);
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
                });
        };

        $scope.deleteCTSP = function (promotion) {
            let idPro = promotion.id;
            $http
                .delete("http://localhost:8080/sanPhamChiTiet/xoa/" + idPro, {
                    headers,
                })
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
        };

        $scope.themAnhMacDinh = function () {
            let data = {
                id: $scope.createProduct.id,
                anhMacDinh: true,
            };
            $http
                .put("http://localhost:8080/sanPhamChiTiet/ThemAnhMacDinh", data, {
                    headers,
                })
                .then(function (response) {
                    Swal.fire({
                        icon: "success",
                        title: "Thêm ảnh thành công",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                })
                .catch(function (errorResponse) {
                    if (errorResponse.status === 400) {
                        const errorMessage = errorResponse.data.message;
                        Swal.fire({
                            icon: "error",
                            title: errorMessage + "",
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    }
                });
        };

        $scope.onImageSelected = function (event) {
            $scope.product.image = event.target.files[0];
        };

        $scope.addProduct = function () {
            let formData = new FormData();
            let data = {
                id: $scope.createProduct.id,
                anhMacDinh: true,
                image: $scope.product.image,
            };

            $http
                .post("/api/products", formData, {
                    headers: { "Content-Type": undefined },
                    transformRequest: angular.identity,
                })
                .then(
                    function (response) {
                        console.log(response);
                    },
                    function (error) {
                        console.error(error);
                    }
                );
        };

        $scope.returnCreate = function () {
            window.location.href = "#!/list-Product";
        };
        let id_product = localStorage.getItem("id_product");

        $scope.themAnh = function (promotion) {
            window.location.href = "#!/list-Img?id=" + id_product;
        };
    }
);

app.controller("ImgController", function ($scope, $http, $routeParams) {
    let token = localStorage.getItem("token");
    let id_product = localStorage.getItem("id_product");
    let headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
    };

    // Updated JavaScript
    // $http.get("http://localhost:8080/sanPhamChiTiet/themAnh/" + id_product, { headers })
    //     .then(function (response) {
    //         const spct = response.data;
    //         $scope.spct = spct;
    //     });

    $http
        .get("http://localhost:8080/sanPhamChiTiet/themAnh/" + id_product, {
            headers,
        })
        .then(function (response) {
            const spct = response.data;

            // Tạo một đối tượng để theo dõi các sản phẩm theo id màu sắc
            const uniqueProducts = {};

            // Lặp qua danh sách sản phẩm chi tiết và chỉ giữ lại một sản phẩm cho mỗi id màu sắc
            spct.forEach(function (product) {
                const mauSacId = product.mauSac.id;

                // Nếu id màu sắc chưa tồn tại trong uniqueProducts, thêm sản phẩm vào
                if (!uniqueProducts[mauSacId]) {
                    uniqueProducts[mauSacId] = product;
                }
            });

            // Chuyển đổi đối tượng thành mảng để gán vào $scope
            $scope.spct = Object.values(uniqueProducts);
        });

    $scope.loadImage = function (input) {
        if (input.files && input.files[0]) {
            let reader = new FileReader();
            reader.onload = function (e) {
                $scope.$apply(function () {
                    $scope.imagePreview = e.target.result;
                });
            };
            reader.readAsDataURL(input.files[0]);
        }
    };

    $scope.img_name = "";

    $scope.hienThiAnh = function (event, spcts) {
        let id = spcts.id;
        let fileInput = event.target;
        let files = fileInput.files;
        let imagePreviewDiv = angular.element(
            document.getElementById("imagePreview" + id)
        );

        // Clear the existing images
        spcts.hinhAnh = [];

        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let reader = new FileReader();

            reader.onload = function (e) {
                let data = {
                    id_spct: id,
                    ten_anh: [file.name],
                };

                $http
                    .post("http://localhost:8080/sanPhamChiTiet/themAnhSanPham", data, {
                        headers,
                    })
                    .then(function (response) {
                        Swal.fire({
                            icon: "success",
                            title: response.data.mess,
                            showConfirmButton: false,
                            timer: 2000,
                        });

                        // Update the specific product's images
                    });

                $http
                    .get("http://localhost:8080/sanPhamChiTiet/hienThiAnh/" + id, {
                        headers,
                    })
                    .then(function (response) {
                        const hinhAnh = response.data;
                        spcts.hinhAnh = hinhAnh;
                        $scope.hinhAnh = hinhAnh;
                    });
            };
            reader.readAsDataURL(file);
        }
    };

    // Additional functions (setAnhMacDinh, xoaAnh) can remain unchanged based on your requirements

    $scope.setAnhMacDinh = function (hinhAnh, spcts) {
        let data = {
            id_hinh_anh: hinhAnh.id,
            id_spct: spcts.id,
        };

        console.log(hinhAnh);

        $http
            .put("http://localhost:8080/sanPhamChiTiet/setAnhMacDinh/", data, {
                headers,
            })
            .then(function (response) {
                Swal.fire({
                    icon: "success",
                    title: response.data.mess,
                    showConfirmButton: false,
                    timer: 2000,
                });
            });
    };

    $scope.xoaAnh = function (hinhAnh, spcts) {
        let data = {
            id_hinh_anh: hinhAnh.id,
            id_spct: spcts.id,
        };

        $http
            .put("http://localhost:8080/sanPhamChiTiet/xoaAnh/", data, { headers })
            .then(function (response) {
                const hinhAnh = response.data;
                $scope.hinhAnh = hinhAnh;

                Swal.fire({
                    icon: "success",
                    title: "Xoa anh thanh cong",
                    showConfirmButton: false,
                    timer: 2000,
                });
            });
    };
});

app.controller("CTSPController", function ($scope, $routeParams, $http) {
    let token = localStorage.getItem("token");
    let headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
    };

    let id = $routeParams.id;

    $http
        .get("http://localhost:8080/chatLieu/danhSach", { headers })
        .then(function (response) {
            const chatLieu = response.data;
            $scope.chatLieu = chatLieu;
        });

    $http
        .get("http://localhost:8080/loaiSanPham/danhSach", { headers })
        .then(function (response) {
            const loaiSanPham = response.data;
            $scope.loaiSanPham = loaiSanPham;
        });

    $http
        .get("http://localhost:8080/nhaSanXuat/danhSach", { headers })
        .then(function (response) {
            const nhaSanXuat = response.data;
            $scope.nhaSanXuat = nhaSanXuat;
        });

    $http
        .get("http://localhost:8080/mauSac/danhSach", { headers })
        .then(function (response) {
            const mauSac = response.data;
            $scope.mauSac = mauSac;
        });

    $http
        .get("http://localhost:8080/kichCo/danhSach", { headers })
        .then(function (response) {
            const kichCo = response.data;
            $scope.kichCo = kichCo;
        });

    $http
        .get("http://localhost:8080/sanPhamChiTiet/dsCTSP", {
            params: { san_pham_id: id },
            headers: headers,
        })
        .then(function (response) {
            const details = response.data;
            $scope.details = details;
        });

    $scope.edit = function (promotion) {
        let id = promotion.id;
        window.location.href = "#!/edit-Product?id=" + idPro;
    };

    $http.get("http://localhost:8080/sanPham/chinhSua/" + id, { headers })
        .then(function (response) {
            const editproduct = response.data;
            $scope.editproduct = editproduct;
        });

    $scope.saveEditProduct = function () {
        let id = $routeParams.id;
        let editProduct = {
            id: id,
            tenSanPham: $scope.editproduct.tenSanPham,
            gia: $scope.editproduct.gia,
            chatLieu_id: $scope.editproduct.chatLieu,
            loaiSanPham_id: $scope.editproduct.loaiSanPham,
            nhaSanXuat_id: $scope.editproduct.nhaSanXuat,
        };

        $http.put("http://localhost:8080/sanPham/luuChinhSua", editProduct, {
            headers,
        })
            .then(function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Sửa thành công",
                    showConfirmButton: false,
                    timer: 2000,
                });
                $http
                    .get("http://localhost:8080/sanPhamChiTiet/dsCTSP", {
                        params: { san_pham_id: id },
                        headers: headers,
                    })
                    .then(function (response) {
                        const details = response.data;
                        $scope.details = details;
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

    $scope.editSPCT = function (promotion) {
        let id = promotion.id;
        window.location.href = "#!/edit-ProductDetails?id=" + id;
    };
});