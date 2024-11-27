const socket = io('http://localhost:3000');
const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ]
};

let peerConnection;
let remoteVideo;

function createPeerConnection() {
  peerConnection = new RTCPeerConnection(configuration);
  console.log(peerConnection)
  // Xử lý ice candidates
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('ice-candidate', event.candidate);
    }
  };

  // Xử lý remote stream
  remoteVideo = app.addScreen('123456');
  console.log(remoteVideo)
  peerConnection.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0]; // thiet lap luong man hinh
  };
}

// socket.on('answer', async (answer) => {
//   try {
//     console.log(answer)
//     await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
//   } catch (err) {
//     console.log(err);
//   }
// })


socket.on('offer', async (offer) => {
  try {
    console.log(offer)
    if (!peerConnection) {
      createPeerConnection();
    }

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit('answer', answer);
  } catch (err) {
    console.log(err);
  }
})

socket.on('ice-candidate', async (candidate) => {
  try {
    console.log(candidate)
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  } catch (err) {
    console.log(err);
  }
})
