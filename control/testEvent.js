let eventsAdded = false;

function addEventListenersToFocusedScreen() {
  const img = document.querySelector('.screen--focus .screen__img');
  const room = "test";

  if (img && !eventsAdded) {
    // Sự kiện mousemove
    img.addEventListener("mousemove", function (e) {
      var posX = img.getBoundingClientRect().left;
      var posY = img.getBoundingClientRect().top;

      var x = e.pageX - posX;
      var y = e.pageY - posY;

      var obj = { "x": x, "y": y, "room": room };
      socket.emit("mouse-move", JSON.stringify(obj));
    });

    // Double click
    img.addEventListener("dblclick", (e) => {
      var obj = { "room": room };
      socket.emit("mouse-dbl-click", JSON.stringify(obj));
    });

    // Ngăn chặn menu chuột phải
    img.addEventListener("contextmenu", (e) => e.preventDefault());

    // Sự kiện mouseup (chuột trái, giữa, phải)
    img.addEventListener("mouseup", function (e) {
      if (e.button == 0) {
        var obj = { "room": room };
        socket.emit("mouse-left-click", JSON.stringify(obj));
      }
      if (e.button == 1) {
        var obj = { "room": room };
        socket.emit("mouse-middle-click", JSON.stringify(obj));
      }
      if (e.button == 2) {
        var obj = { "room": room };
        socket.emit("mouse-right-click", JSON.stringify(obj));
      }
    });

    // drag
    img.addEventListener("dragstart", function (e) {
      var posX = img.getBoundingClientRect().left;
      var posY = img.getBoundingClientRect().top;

      var x = e.pageX - posX;
      var y = e.pageY - posY;

      var obj = { "x": x, "y": y, "room": room };  // Gửi dữ liệu lúc bắt đầu kéo
      socket.emit("drag-start", JSON.stringify(obj));
    });

    img.addEventListener("drag", function (e) {
      var posX = img.getBoundingClientRect().left;
      var posY = img.getBoundingClientRect().top;

      var x = e.pageX - posX;
      var y = e.pageY - posY;

      var obj = { "x": x, "y": y, "room": room };  // Gửi dữ liệu trong quá trình kéo
      socket.emit("mouse-drag", JSON.stringify(obj));  // Gửi sự kiện kéo tới server
    });

    img.addEventListener("dragend", function (e) {
      var posX = img.getBoundingClientRect().left;
      var posY = img.getBoundingClientRect().top;

      var x = e.pageX - posX;
      var y = e.pageY - posY;

      var obj = { "x": x, "y": y, "room": room };  // Gửi dữ liệu khi kết thúc kéo
      socket.emit("drag-end", JSON.stringify(obj));
    });


    // Sự kiện lăn chuột
    img.addEventListener("wheel", function (e) {
      var delta = e.deltaY || e.deltaX;
      var obj = { "delta": delta, "room": room };
      socket.emit("mouse-wheel", JSON.stringify(obj));
    });


    // Sự kiện type (khi nhấn phím)
    window.addEventListener("keyup", function (e) {
      console.log(e.key);
      var obj = { "key": e.key, "room": room };
      socket.emit("type", JSON.stringify(obj));
    });

    eventsAdded = true;
  }
}
