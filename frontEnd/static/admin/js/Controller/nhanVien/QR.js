app.controller("CreateNhanVienControllerQR", QRController);

function QRController($scope) {
  var vm = this;
  vm.duLieuQuet = null;
  vm.createStaff = {}; // Khởi tạo đối tượng createStaff

  // Tạo đối tượng quét
  var quetMQR = new Instascan.Scanner({
    video: document.getElementById("preview"),
  });

  // Xử lý sự kiện quét mã QR
  quetMQR.addListener("scan", function (noiDung) {
    $scope.$apply(function () {
      //   vm.duLieuQuet = decodeQRContent(noiDung);
      vm.duLieuQuet = fixVietnameseCharacters(noiDung);

      //   var qrCodeParts = vm.duLieuQuet.split("||");
      var qrCodeParts = vm.duLieuQuet.split(/(?:\||\|\|)/);

      // Set the values to the corresponding properties of createStaff
      vm.createStaff = {
        hoTen: qrCodeParts[2] || "", // Full Name
        ngaySinh: qrCodeParts[3] || "", // Date of Birth
        gioiTinh: qrCodeParts[4] || "", // Gender
        diaChi: qrCodeParts[5] || "", // Address
        // You can set other properties accordingly
      };
      localStorage.setItem("qr", JSON.stringify(vm.createStaff));

      angular.element(document.getElementById("inputName")).val(vm.createStaff.hoTen);
      angular.element(document.getElementById("inputPhone")).val(vm.createStaff.soDienThoai);
      angular.element(document.getElementById("inputEmail")).val(vm.createStaff.email);
      angular.element(document.getElementById("inputDob")).val(vm.createStaff.ngaySinh);
      angular.element(document.getElementById("inputAddress")).val(vm.createStaff.diaChi);


      console.log("vm.createStaff", vm.createStaff);
      console.log("qrCodeParts", qrCodeParts);
      //   $timeout(quetMQR.stop(), 2000);
      setTimeout(function () {
        quetMQR.stop();
      }, 2000);
    });
  });

  // quetMQR.addListener('scan', function (noiDung) {
  //     $scope.$apply(function () {
  //     });
  // });

  // Bắt đầu quét khi nút được nhấp
  vm.batDauQuet = function () {
    Instascan.Camera.getCameras()
      .then(function (cameras) {
        if (cameras.length > 0) {
          quetMQR.start(cameras[0]);
        } else {
          console.error("Không tìm thấy camera.");
        }
      })
      .catch(function (loi) {
        console.error("Lỗi khi lấy danh sách camera:", loi);
      });
  };

  // Hàm giải mã nội dung từ QR
  function decodeQRContent(noiDung) {
    try {
      return iconv.decode(new Buffer(noiDung, "binary"), "utf-8");
    } catch (error) {
      console.error("Lỗi khi giải mã QR:", error);
      return noiDung;
    }
  }
  function fixVietnameseCharacters(str) {
    var decodedStr = decodeURIComponent(escape(str));
    return decodedStr;
  }
}
