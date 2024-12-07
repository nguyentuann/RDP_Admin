var socket;
const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ]
};

let peerConnection;
let remoteVideo;
let dataChannel;
let eventsAdded;

function resetPeerConnection() {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
    dataChannel = null;
    remoteVideo = null;
  }
}


function createPeerConnection() {
  peerConnection = new RTCPeerConnection(configuration);
  console.log("Tao: " + peerConnection) //so 2


  peerConnection.ondatachannel = (event) => {
    console.log(event)
    dataChannel = event.channel;
    dataChannel.onopen = () => {
      console.log("DataChannel đã mở");
    };
    dataChannel.onclose = () => {
      console.log("DataChannel đã đóng");
    };
  };


  // Xử lý ice candidates
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("Gui ice-candidate: " + event.candidate) //so 4
      socket.emit('ice-candidate', event.candidate);
    }
  };

  // Xử lý remote stream
  remoteVideo = app.addScreen('1');
  console.log(remoteVideo)
  peerConnection.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0]; // thiet lap luong man hinh
  };
}


function startShared(id) {
  socket = io('http://localhost:3000');
  socket.emit('request-screen', JSON.stringify({
    "type": "request-screen",
    "data": id,
  }));

  socket.on('offer', async (offer) => {
    console.log("Nhan Offer:" + offer); // so 1
    try {
      if (!peerConnection) {
        createPeerConnection();
      } else {
        resetPeerConnection();
        createPeerConnection();
      }

      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit('answer', answer);
      console.log("Gui answer: " + answer) // so 3
    } catch (err) {
      console.log(err);
    }
  })
}







