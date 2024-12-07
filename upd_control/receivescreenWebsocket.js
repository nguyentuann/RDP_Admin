

let socket;
let peerConnection;
let remoteVideo;
let dataChannel;
let isSocketConnected = false;

function resetPeerConnection() {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
    dataChannel = null;
    remoteVideo = null;
  }
}


// Cấu hình ICE servers cho WebRTC
const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

// Hàm khởi tạo WebSocket connection
function connectWebSocket(token) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log('WebSocket đã kết nối, không cần tạo lại');
    return;
  }

  try {
    console.log('Đang kết nối đến WebSocket với token:', token);

    socket = new WebSocket('ws://10.10.50.115:8088/rdp/ws');

    socket.onopen = () => {
      console.log('WebSocket đã kết nối thành công');
      isSocketConnected = true;

      // Gửi xác thực
      sendMessage('authentication', { token: token });
      console.log('Đã gửi token xác thực');
    };

    socket.onmessage = (event) => {
      console.log("Nhan duoc event: " + event);
      try {
        const data = JSON.parse(event.data);
        console.log('Nhận được message:', data);

        switch (data.type) {
          case 'offer':
            handleOffer(data.data.offer);
            break;  
          case 'ice-candidate':
            handleIceCandidate(data.data['ice-candidate']);
            break;
          default:
            console.log('Không xử lý được loại message:', data.type);
        }
      } catch (error) {
        console.error('Lỗi khi parse message:', error);
      }
    };

    socket.onerror = (event) => {
      console.error('Lỗi WebSocket:', event);
    };

    socket.onclose = (event) => {
      console.log('WebSocket đã đóng:', event);
      isSocketConnected = false;
    };
  } catch (error) {
    console.error('Không thể kết nối WebSocket:', error);
  }
}

// Gửi message qua WebSocket
function sendMessage(type, data) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    const message = { type: type, data: data };
    socket.send(JSON.stringify(message));
    console.log(`Đã gửi message: ${type}`, data);
  } else {
    console.error('WebSocket chưa được kết nối');
  }
}

// Tạo kết nối WebRTC
function createPeerConnection() {
  peerConnection = new RTCPeerConnection(configuration);

  // Lắng nghe data channel
  peerConnection.ondatachannel = (event) => {
    dataChannel = event.channel;
    console.log(event.channel);
    dataChannel.onopen = () => console.log('DataChannel đã mở');
    dataChannel.onclose = () => console.log('DataChannel đã đóng');
  };

  // Xử lý ICE candidates
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      sendMessage('ice-candidate', { 'ice-candidate': event.candidate });
      console.log('Đã gửi ice-candidate:', event.candidate);
    }
  };

  // Xử lý remote stream
  remoteVideo = app.addScreen('1');
  peerConnection.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
    console.log('Đã nhận track:', event.streams[0]);
  };
}

// Xử lý khi nhận được offer
async function handleOffer(offer) {
  console.log('Nhận được offer:', offer);
  try {
    if(!peerConnection) {
      createPeerConnection();
    } else {
      resetPeerConnection();
      createPeerConnection();
    }
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    sendMessage('answer', { answer: answer });
    console.log('Đã gửi answer:', answer);
  } catch (err) {
    console.error('Lỗi khi xử lý offer:', err);
  }
}

// Xử lý khi nhận được answer
async function handleAnswer(answer) {
  console.log('Nhận được answer:', answer);
  try {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  } catch (err) {
    console.error('Lỗi khi xử lý answer:', err);
  }
}

// Xử lý khi nhận được ice-candidate
function handleIceCandidate(candidate) {
  console.log('Nhận được ICE candidate:', candidate);
  try {
    const iceCandidate = new RTCIceCandidate(candidate);
    peerConnection.addIceCandidate(iceCandidate);
  } catch (err) {
    console.error('Lỗi khi thêm ICE candidate:', err);
  }
}

// Bắt đầu chia sẻ màn hình
function startShared(id) {
  console.log(id);
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    console.error('Token không hợp lệ');
    return;
  }
  // Đảm bảo kết nối WebSocket
  connectWebSocket(token);

  connectClient();
}


function connectClient() {
  const interval = setInterval(() => {
    if (isSocketConnected) {
      sendMessage('start-share-screen', { departmentId: 4 });
      console.log('Đã gửi sự kiện start-share-screen');
      clearInterval(interval);
    }
  }, 1000);
}




// let socket;
// const configuration = {
//   iceServers: [
//     { urls: 'stun:stun.l.google.com:19302' }
//   ]
// };

// let peerConnection;
// let remoteVideo;
// let dataChannel;
// let eventsAdded;

// // Khởi tạo WebSocket connection với token bearer
// function connectWebSocket(token) {
//   try {
//     console.log('Đang kết nối đến WebSocket với token:', token);

//     // Kết nối WebSocket
//     socket = new WebSocket('ws://192.168.33.113:8088/rdp/ws');

//     socket.onopen = () => {
//       console.log('WebSocket đã kết nối thành công');

//       sendMessage('authentication', { token: token })
//       console.log('Đã gửi token xác thực');

//       sendMessage('start-share-screen', { id: '33' });
//       console.log('da gui start share')

//     };

   

//     socket.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         console.log('Nhận được message:', data);
//         if (data.type === 'offer') {
//           handleOffer(data.offer);
//         } else if (data.type === 'answer') {
//           handleAnswer(data.answer);
//         } else if (data.type === 'ice-candidate') {
//           handleIceCandidate(data.candidate);
//         }
//       } catch (error) {
//         console.error('Lỗi khi parse message:', error);
//       }
//     };

//     socket.onerror = (event) => {
//       console.error('Lỗi WebSocket:', event);
//     };

//     socket.onclose = (event) => {
//       console.log('WebSocket đã đóng:', event);
//     };

//   } catch (error) {
//     console.error('Không thể kết nối WebSocket:', error);
//     return null;
//   }
// }

// // Tạo PeerConnection
// function createPeerConnection() {
//   peerConnection = new RTCPeerConnection(configuration);
//   console.log("Tao: " + peerConnection); //so 2

//   peerConnection.ondatachannel = (event) => {
//     console.log(event);
//     dataChannel = event.channel;
//     dataChannel.onopen = () => {
//       console.log("DataChannel đã mở");
//     };
//     dataChannel.onclose = () => {
//       console.log("DataChannel đã đóng");
//     };
//   };

//   // Xử lý ice candidates
//   peerConnection.onicecandidate = (event) => {
//     if (event.candidate) {
//       console.log("Gui ice-candidate: " + event.candidate); //so 4
//       // socket.send(JSON.stringify({ type: 'ice-candidate', data: event.candidate }));
//       sendMessage('ice-candidate', { 'ice-candidate': event.candidate })
//     }
//   };

//   // Xử lý remote stream
//   remoteVideo = app.addScreen('33');
//   peerConnection.ontrack = (event) => {
//     remoteVideo.srcObject = event.streams[0]; // Thiết lập lượng màn hình
//   };
// }

// // Xử lý khi nhận được offer
// async function handleOffer(offer) {
//   console.log("Nhan Offer:" + offer); // so 1
//   try {
//     if (!peerConnection) {
//       createPeerConnection();
//     }

//     await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
//     const answer = await peerConnection.createAnswer();
//     await peerConnection.setLocalDescription(answer);
//     // socket.send(JSON.stringify({ type: 'answer', data: answer }));
//     sendMessage('answer', { answer: answer });
//     console.log("Gui answer: " + answer); // so 3
//   } catch (err) {
//     console.log(err);
//   }
// }

// // Xử lý khi nhận được answer
// async function handleAnswer(answer) {
//   try {
//     await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
//   } catch (err) {
//     console.log('Lỗi khi thiết lập remote description cho answer:', err);
//   }
// }

// // Xử lý khi nhận được ice-candidate
// function handleIceCandidate(candidate) {
//   try {
//     const iceCandidate = new RTCIceCandidate(candidate);
//     peerConnection.addIceCandidate(iceCandidate);
//   } catch (err) {
//     console.log('Lỗi khi thêm ICE candidate:', err);
//   }
// }

// // Sử dụng function
// const token = localStorage.getItem("jwtToken");
// console.log("token:" + token)
// // const wsConnection = connectWebSocket(token);
// function startShared(id) {
//   connectWebSocket(token);
// }

// // Gửi message (nếu cần)
// function sendMessage(type, data) {
//   if (socket && socket.readyState === WebSocket.OPEN) {
//     const message = {
//       type: type,
//       data: data
//     }
//     socket.send(JSON.stringify(message));
//   } else {
//     console.error('WebSocket chưa được kết nối');
//   }
// }
