const params = new URLSearchParams(window.location.search);
const screenID = params.get('screenID');

// Lấy màn hình được focus theo ID và hiển thị
const focusedScreenDiv = document.getElementById('focused-screen');
// Render nội dung của screenID
focusedScreenDiv.innerHTML = `Screen Content for ID: ${screenID}`;
