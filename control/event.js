const img = document.querySelector('.screen--focus .screen__img');

// Biến dùng chung cho các sự kiện kéo chuột
var dragging = false;
var startX, startY;

// Hàm phát tín hiệu cho các sự kiện chuột với phím
function emitMouseEvent(action, e, additionalData = {}) {
  var obj = {
    "room": room,
    "action": action,
  };
  socket.emit(`mouse-${action}`, JSON.stringify(obj));
}

// Xử lý sự kiện mousemove
img.mousemove(function(e) {
  var posX = $(this).offset().left;
  var posY = $(this).offset().top;
  var x = e.pageX - posX;
  var y = e.pageY - posY;

  var obj = {"x": x, "y": y};
  emitMouseEvent("move", e, obj);
});

// Xử lý click chuột
img.click(function(e) {
  emitMouseEvent("click", e);

  // Kiểm tra phím Ctrl, Shift khi nhấn chuột
  if (e.ctrlKey) {
    emitMouseEvent("click-with-key", e, { "key": "Ctrl" });
  } else if (e.shiftKey) {
    emitMouseEvent("click-with-key", e, { "key": "Shift" });
  }
});

// Xử lý double-click
img.dblclick(function(e) {
  emitMouseEvent("dblclick", e);

  // Kiểm tra phím Alt khi double-click
  if (e.altKey) {
    emitMouseEvent("dblclick-with-key", e, { "key": "Alt" });
  }
});

// Xử lý mouse wheel
img.on('wheel', function(e) {
  emitMouseEvent("wheel", e, { "deltaY": e.originalEvent.deltaY });

  // Kiểm tra phím Meta khi cuộn chuột
  if (e.metaKey) {
    emitMouseEvent("wheel-with-key", e, { "key": "Meta", "deltaY": e.originalEvent.deltaY });
  }
});

// Xử lý mouse drag
img.mousedown(function(e) {
  if (e.shiftKey) {
    dragging = true;
    startX = e.pageX;
    startY = e.pageY;
  }
});

img.mousemove(function(e) {
  if (dragging) {
    var obj = {
      "action": "drag",
      "key": "Shift",
      "dragged": {
        "startX": startX,
        "startY": startY,
        "currentX": e.pageX,
        "currentY": e.pageY
      }
    };
    emitMouseEvent("drag-with-key", e, obj);
  }
});

img.mouseup(function(e) {
  dragging = false;
});

// key up
$(window).bind("keyup",function(e){
  var obj = {"key": e.key, "room": room}
  socket.emit("type", JSON.stringify(obj));
})

//key down
$(window).bind("keydown", function(e) {
  var obj = {
    "key": e.key,
    "action": "keydown",
    "room": room
  };
  socket.emit("key-action", JSON.stringify(obj));
});

//key press
$(window).bind("keypress", function(e) {
  var obj = {
    "key": e.key,
    "action": "keypress",
    "room": room
  };
  socket.emit("key-action", JSON.stringify(obj));
});

//key combination
$(window).bind("keydown", function(e) {
  var obj = {
    "key": e.key,
    "room": room
  };

  if (e.ctrlKey) {
    obj["combination"] = "Ctrl+" + e.key;
    socket.emit("key-combination", JSON.stringify(obj));
  } else if (e.shiftKey) {
    obj["combination"] = "Shift+" + e.key;
    socket.emit("key-combination", JSON.stringify(obj));
  } else if (e.altKey) {
    obj["combination"] = "Alt+" + e.key;
    socket.emit("key-combination", JSON.stringify(obj));
  } else {
    socket.emit("key-action", JSON.stringify(obj));
  }
});


