function sendEvent(obj) {
  dataChannel.send(JSON.stringify(obj));
}


function addEventListenersToFocusedScreen() {
  const img = document.querySelector('.screen--focus');
  const video = document.querySelector('.screen__img');
  const w = video.videoWidth * 1.25;
  const h = video.videoHeight * 1.25;
  console.log(`Width: ${w}, Height: ${h}`);

  function realCoodinates (e, data) {

    // Tọa độ tương đối trên phần tử img
    const xRelative = e.pageX - data.x;
    const yRelative = e.pageY - data.y;

    const imgWidth = img.offsetWidth;
    const imgHeight = img.offsetHeight;

    const scaleX = w / imgWidth;
    const scaleY = h / imgHeight;

    const xReal = xRelative * scaleX;
    const yReal = yRelative * scaleY;
    return { x: xReal, y: yReal }
  }

  if (img) {
    // Sự kiện mousemove
    img.addEventListener("mousemove", function (e) {
      const posX = img.getBoundingClientRect().left;
      const posY = img.getBoundingClientRect().top;
      
      // const real = realCoodinates(e, {x: posX, y: posY});

      // Tọa độ tương đối trên phần tử img
      const xRelative = e.pageX - posX;
      const yRelative = e.pageY - posY;

      const imgWidth = img.offsetWidth;
      const imgHeight = img.offsetHeight;

      const scaleX = w / imgWidth;
      const scaleY = h / imgHeight;

      const xReal = xRelative * scaleX;
      const yReal = yRelative * scaleY;

      const obj = {
        type: "mousemove",
        data: {
          x: xReal,
          y: yReal,
        }
      };

      const objDrag = {
        type: "mouse-drag",
        data: {
          x: xReal,
          y: yReal,
        }
      }

      // Gửi sự kiện với tọa độ thật
      sendEvent(obj);
      // sendEvent(objDrag);
    });

    // Double click
    img.addEventListener("dblclick", (e) => {
      const obj = {
        type: "dblclick",
        data: {}
      };
      sendEvent(obj)
    });

    // Ngăn chặn menu chuột phải
    img.addEventListener("contextmenu", (e) => e.preventDefault());

    // Sự kiện mouseup (chuột trái, giữa, phải)
    img.addEventListener("mouseup", function (e) {
      var obj;
      if (e.button === 0) {
        obj = {
          type: "mouse-left-click",
          data: {}
        };
        sendEvent(obj)
      }
      if (e.button === 1) {
        obj = {
          type: "mouse-middle-click",
          data: {}
        };
        sendEvent(obj)
      }
      if (e.button === 2) {
        obj = {
          type: "mouse-right-click",
          data: {}
        };
        sendEvent(obj)
      }
    });

    // drag
    img.addEventListener("mousedown", function (e) {
      const posX = img.getBoundingClientRect().left;
      const posY = img.getBoundingClientRect().top;
      
      const real = realCoodinates(e, {x: posX, y: posY});

      const obj = {
        type: "drag-start",
        data: {
          x: real.x,
          y: real.y,
        }
      };
      sendEvent(obj)
    });

    // img.addEventListener("mouse-drag", function (e) {
    //   const posX = img.getBoundingClientRect().left;
    //   const posY = img.getBoundingClientRect().top;

    //   const x = e.pageX - posX;
    //   const y = e.pageY - posY;

    //   const obj = {
    //     type: "mouse-drag",
    //     data: {
    //       x: x,
    //       y: y,
    //     }
    //   };
    //   sendEvent(obj)
    // });

    img.addEventListener("mouseup", function (e) {
      const posX = img.getBoundingClientRect().left;
      const posY = img.getBoundingClientRect().top;
      
      const real = realCoodinates(e, {x: posX, y: posY});

      const obj = {
        type: "drag-end",
        data: {
          x: real.x,
          y: real.y,
        }
      };
      sendEvent(obj)
    });

    // Sự kiện lăn chuột
    img.addEventListener("wheel", function (e) {
      const obj = {
        "type": "wheel",
        "data": {
          x: e.deltaX,
          y: e.deltaY
        },
      };
      sendEvent(obj)
    });

    // Sự kiện type (khi nhấn phím)
    window.addEventListener("keyup", function (e) {
      console.log(e.key)
      const obj = {
        type: "keyup",
        data: {
          key: e.key
        }
      };
      sendEvent(obj)
    });

    // window.addEventListener("keydown", function (e) {
    //   const blockedKeys = ['Control', 'Alt', 'Meta', 'Shift']; // 'Meta' là phím Windows hoặc Command
    //   if (blockedKeys.includes(e.key)) {
    //     e.preventDefault();
    //   }
    //   console.log(e.key)
    //   const obj = {
    //     type: "keydown",
    //     data: {
    //       key: e.key
    //     }
    //   };
    //   sendEvent(obj)
    // });

    // eventsAdded = true;
  }
}  