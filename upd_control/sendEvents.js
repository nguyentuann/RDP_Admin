let eventsAdded = false;

function addEventListenersToFocusedScreen() {
  const img = document.querySelector('.screen--focus .screen__img');
  console.log(img)
  const room = "test";

  if (img && !eventsAdded) {
    // Sự kiện mousemove
    img.addEventListener("mousemove", function (e) {
      const posX = img.getBoundingClientRect().left;
      const posY = img.getBoundingClientRect().top;

      const x = e.pageX - posX;
      const y = e.pageY - posY;

      const obj = { "x": x, "y": y, "room": room };
      socket.emit("mouse-move", JSON.stringify(obj));
    });

    // Double click
    img.addEventListener("dblclick", (e) => {
      const obj = { "room": room };
      socket.emit("mouse-dbl-click", JSON.stringify(obj));
    });

    // Ngăn chặn menu chuột phải
    img.addEventListener("contextmenu", (e) => e.preventDefault());

    // Sự kiện mouseup (chuột trái, giữa, phải)
    img.addEventListener("mouseup", function (e) {
      const obj = { "room": room };
      if (e.button === 0) {
        socket.emit("mouse-left-click", JSON.stringify(obj));
      }
      if (e.button === 1) {
        socket.emit("mouse-middle-click", JSON.stringify(obj));
      }
      if (e.button === 2) {
        socket.emit("mouse-right-click", JSON.stringify(obj));
      }
    });

    // drag
    img.addEventListener("dragstart", function (e) {
      const posX = img.getBoundingClientRect().left;
      const posY = img.getBoundingClientRect().top;

      const x = e.pageX - posX;
      const y = e.pageY - posY;

      const obj = { "x": x, "y": y, "room": room };  // Gửi dữ liệu lúc bắt đầu kéo
      socket.emit("drag-start", JSON.stringify(obj));
    });

    img.addEventListener("drag", function (e) {
      const posX = img.getBoundingClientRect().left;
      const posY = img.getBoundingClientRect().top;

      const x = e.pageX - posX;
      const y = e.pageY - posY;

      const obj = { "x": x, "y": y, "room": room };  // Gửi dữ liệu trong quá trình kéo
      socket.emit("mouse-drag", JSON.stringify(obj));  // Gửi sự kiện kéo tới server
    });

    img.addEventListener("dragend", function (e) {
      const posX = img.getBoundingClientRect().left;
      const posY = img.getBoundingClientRect().top;

      const x = e.pageX - posX;
      const y = e.pageY - posY;

      const obj = { "x": x, "y": y, "room": room };  // Gửi dữ liệu khi kết thúc kéo
      socket.emit("drag-end", JSON.stringify(obj));
    });

    // Sự kiện lăn chuột
    img.addEventListener("wheel", function (e) {
      const delta = e.deltaY || e.deltaX;
      const obj = { "delta": delta, "room": room };
      socket.emit("mouse-wheel", JSON.stringify(obj));
    });

    // Sự kiện type (khi nhấn phím)
    window.addEventListener("keyup", function (e) {
      // Có thể kiểm tra thêm phím (ví dụ, chỉ gửi sự kiện nếu đó là các phím cần thiết)
      console.log(e.key);
      const obj = { "key": e.key, "room": room };
      socket.emit("type", JSON.stringify(obj));
    });

    eventsAdded = true;
  }
}  