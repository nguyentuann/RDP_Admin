// Khởi tạo WebSocket connection với token bearer
function connectWebSocket(token) {
  // const headers = {
  //     'Authorization': `Bearer ${token}`
  // };

  try {
      // Thêm logging để debug
      console.log('Đang kết nối đến WebSocket với token:', token);
      
      const ws = new WebSocket('ws://192.168.33.113:8088/rdp/ws');
      
      ws.onopen = () => {
        console.log('WebSocket đã kết nối thành công');
    
        // Gửi thông điệp xác thực chứa token
        const authMessage = {
            "token": token,          
        };
        
        ws.send(JSON.stringify(authMessage));  // Gửi thông điệp xác thực
        console.log('Đã gửi token xác thực');
    };

      ws.onmessage = (event) => {
          try {
              const data = JSON.parse(event.data);
              console.log('Nhận được message:', data);
          } catch (error) {
              console.error('Lỗi khi parse message:', error);
          }
      };

      ws.onerror = (event) => {
          console.error('Lỗi WebSocket:', {
              error: event.error,
              type: event.type,
              message: event.message,
              // Log thêm thông tin về connection
              readyState: ws.readyState,
              url: ws.url
          });
      };

      ws.onclose = (event) => {
          console.log('WebSocket đã đóng:', {
              code: event.code,
              reason: event.reason,
              wasClean: event.wasClean
          });
          
          // Thêm mã lỗi cụ thể
          switch (event.code) {
              case 1000:
                  console.log("Đóng kết nối bình thường");
                  break;
              case 1006:
                  console.log("Kết nối bị đóng bất thường - có thể do vấn đề handshake");
                  break;
              case 1015:
                  console.log("Lỗi TLS handshake");
                  break;
              default:
                  console.log("Đóng kết nối với mã:", event.code);
          }
      };

      return ws;
  } catch (error) {
      console.error('Không thể kết nối WebSocket:', error);
      return null;
  }
}

// Sử dụng function
const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJzY29wZSI6IlJPTEVfQURNSU4iLCJpc3MiOiJyZHAuY29tIiwiZXhwIjoxNzMzMTQ2MjE4LCJpYXQiOjE3MzMwNTk4MTgsImp0aSI6ImM1NDMyZTAyLWRiMTEtNGVkNC04NTYyLWI1ZGZhMDkyMTdhZCJ9.z1kdmtmcjTqTa4nG2OCi52wrVKWSntOao6QZhhMfWeXyYs_eTK1j20fPaFe9OZUJctTutHTN28y-li3Q1I5HlQ'; 
const wsConnection = connectWebSocket(token);
console.log(wsConnection);

// Gửi message (nếu cần)
function sendMessage(message) {
  if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
      wsConnection.send(JSON.stringify(message));
  } else {
      console.error('WebSocket chưa được kết nối');
  }
}