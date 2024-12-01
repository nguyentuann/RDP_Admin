

function sendEvent(obj) {
    dataChannel.send(JSON.stringify(obj));
}


function addEventListenersToFocusedScreen() {
  const img = document.querySelector('.screen--focus .screen__img');
  console.log(img)

  if (img) {
    // Sự kiện mousemove
    img.addEventListener("mousemove", function (e) {
      const posX = img.getBoundingClientRect().left;
      const posY = img.getBoundingClientRect().top;

      const x = e.pageX - posX;
      const y = e.pageY - posY;

      const obj = {
        "type": "mousemove",
        "x": x,
        "y": y,
      };
      // socket.emit("mouse-move", JSON.stringify(obj));
      sendEvent(obj)
    });

    // Double click
    img.addEventListener("dblclick", (e) => {
      const obj = {
        "type": "dblclick",
        "data": {}
      };
      // socket.emit("mouse-dbl-click", JSON.stringify(obj));
      sendEvent(obj)
    });

    // Ngăn chặn menu chuột phải
    img.addEventListener("contextmenu", (e) => e.preventDefault());

    // Sự kiện mouseup (chuột trái, giữa, phải)
    img.addEventListener("mouseup", function (e) {
      var obj;
      if (e.button === 0) {
        obj = {
          "type": "mouse-left-click",
          "data": {}
        };
        // socket.emit("mouse-left-click", JSON.stringify(obj));
        sendEvent(obj)
      }
      if (e.button === 1) {
        obj = {
          "type": "mouse-middle-click",
          "data": {}
        };
        // socket.emit("mouse-middle-click", JSON.stringify(obj));
        sendEvent(obj)
      }
      if (e.button === 2) {
        obj = {
          "type": "mouse-right-click",
          "data": {}
        };
        // socket.emit("mouse-right-click", JSON.stringify(obj));
        sendEvent(obj)
      }
    });

    // drag
    img.addEventListener("dragstart", function (e) {
      const posX = img.getBoundingClientRect().left;
      const posY = img.getBoundingClientRect().top;

      const x = e.pageX - posX;
      const y = e.pageY - posY;

      const obj = {
        "type": "drag-start",
        "data": {
          "x": x,
          "y": y,
        }
      };  
      // socket.emit("drag-start", JSON.stringify(obj));
      sendEvent(obj)
    });

    img.addEventListener("drag", function (e) {
      const posX = img.getBoundingClientRect().left;
      const posY = img.getBoundingClientRect().top;

      const x = e.pageX - posX;
      const y = e.pageY - posY;

      const obj = {
        "type": "mouse-drag",
        "data": {
          "x": x,
          "y": y,
        }
      }; 
      // socket.emit("mouse-drag", JSON.stringify(obj));  
      sendEvent(obj)
    });

    img.addEventListener("dragend", function (e) {
      const posX = img.getBoundingClientRect().left;
      const posY = img.getBoundingClientRect().top;

      const x = e.pageX - posX;
      const y = e.pageY - posY;

      const obj = {
        "type": "drag-end",
        "data": {
          "x": x,
          "y": y,
        }
      };  
      // socket.emit("drag-end", JSON.stringify(obj));
      sendEvent(obj)
    });

    // Sự kiện lăn chuột
    img.addEventListener("wheel", function (e) {
      const delta = e.deltaY || e.deltaX;
      const obj = { 
        "type": "wheel",
        "data": delta, 
      };
      // socket.emit("mouse-wheel", JSON.stringify(obj));
      sendEvent(obj)
    });

    // Sự kiện type (khi nhấn phím)
    window.addEventListener("keyup", function (e) {
      const obj = { 
        "type": "keyup",
        "data": e.key
      };
      // socket.emit("type", JSON.stringify(obj));
      sendEvent(obj)
    });

    // eventsAdded = true;
  }
}  