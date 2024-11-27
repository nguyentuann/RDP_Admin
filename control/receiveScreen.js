const ip = 'http://192.168.1.10:5000';
const socket = io.connect(ip);

const initializeScreenReceiver = (room) => {
  console.log("Kết nối thành công");

  // Tham gia vào room
  socket.emit("join-message", room);

  // Đón nhận dữ liệu và cập nhật màn hình
  socket.on("screen-data", function (message) {

    const { id, image } = message;

    const existingImg = document.querySelector(`.screen__${id}`);
    if (existingImg) {
      existingImg.setAttribute("src", "data:image/png;base64," + image);
    } else {
      const img = app.addScreen(id); 
      img.setAttribute("src", "data:image/png;base64," + image);
    }
  });

  socket.on("client-left", function(data) {
    console.log("Ngắt kết nối: "+ data.id)
    app.removeScreen(data.id);
  });

  socket.on("client-stop", function(data) {
    console.log("Ngắt kết nối: "+ data.id)
    app.removeScreen(data.id);
  });
};

// Khởi động ứng dụng
window.onload = function () {
  const room = 'test';
  initializeScreenReceiver(room); 
  app.start(); 
};


