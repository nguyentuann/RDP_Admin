
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const inforBody = $('.infor__body');

let errorsMap = {}
let notifis = []
let currentSortColumn = '';
let sortOrder = 'asc';
var sortedNotifis;
let chartInstance = null;

function addRowNotifi(data) {
  const str = `
    <tr>
      <td class="body__action">
        <button class="btn btn--delete" onclick="deleteNotifi(this)">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
      <td>${data.id}</td>
      <td>${data.idEmp}</td>
      <td>${errorsMap[data.idErr] || data.idErr}</td>
    </tr>
  `;
  inforBody.innerHTML += str;
}

async function fetchErrors() {
  try {

    const errors = await allApi.fetchData('errors');
    if (errors) {
      errors.forEach(error => {
        errorsMap[error.id] = error.name;
      });
    }

  } catch (error) {
    console.log(error);
  }
}

async function fetchNotifis() {
  try {
    await fetchErrors();
    const response = await fetch('http://localhost:3000/notification');
    notifis = await response.json();
    notifis.forEach(notifi => addRowNotifi(notifi))
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener("DOMContentLoaded", fetchNotifis);

// xóa thông báo
async function deleteNotifi(button) {
  const row = button.closest("tr");
  const id = row.cells[1].textContent;
  const isConfirmed = confirm("Bạn có chắc chắn muốn xóa thông báo này?");
  if (isConfirmed) {
    var xhttp = new XMLHttpRequest();
    xhttp.open('DELETE', `http://localhost:3000/notification/${id}`, true);
    xhttp.onload = () => {
      row.remove();
    }
    xhttp.send();
  }
}

// hàm tìm kiếm
function searchNotifi() {
  const searchOption = document.getElementById('searchOption').value;
  const searchTerm = document.getElementById('search').value.toLowerCase();
  inforBody.innerHTML = '';

  const filteredNotifis = notifis.filter(notifi => {
    if (searchOption === 'idEmp') {
      return notifi.idEmp.toLowerCase().includes(searchTerm);
    } else if (searchOption === 'name') {
      const errorName = errorsMap[notifi.idErr];
      console.log(errorName)
      return errorName && errorName.toLowerCase().includes(searchTerm);
    }
    return false;
  });

  filteredNotifis.forEach(notifi => addRowNotifi(notifi));
}

$('.search').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    searchUnit();
  }
})


// sắp xếp thông báo
function sortNotifis(column) {
  // Kiểm tra nếu cột hiện tại đã được sắp xếp
  if (currentSortColumn === column) {
    // Nếu đã sắp xếp theo cột này, đảo ngược thứ tự
    sortOrder = (sortOrder === 'asc') ? 'desc' : 'asc';
  } else {
    // Nếu cột khác được chọn, sắp xếp theo thứ tự tăng dần
    sortOrder = 'asc';
  }

  currentSortColumn = column; // Cập nhật cột hiện tại

  // Sắp xếp dựa trên cột được chỉ định
  sortedNotifis = notifis.sort((a, b) => {
    let compareA, compareB;

    // Kiểm tra cột nào đang được sắp xếp
    if (column === 'content') {
      // Kiểm tra nếu errorName tồn tại trong errorsMap và chuyển nó thành chuỗi
      const errorNameA = errorsMap[a.idErr] || '';  // Sử dụng idErr thay vì idEmp
      const errorNameB = errorsMap[b.idErr] || '';
      compareA = errorNameA.toLowerCase();  // Chuyển thành chuỗi và so sánh không phân biệt hoa thường
      compareB = errorNameB.toLowerCase();
    } else {
      // Đối với các cột còn lại, bao gồm "Mã nhân viên"
      compareA = (a[column] || '').toString().toLowerCase(); // Chuyển tất cả thành chuỗi
      compareB = (b[column] || '').toString().toLowerCase(); // Chuyển tất cả thành chuỗi
    }

    // Sắp xếp theo thứ tự tăng dần hoặc giảm dần
    return (sortOrder === 'asc') ? compareA.localeCompare(compareB) : compareB.localeCompare(compareA);
  });

  // Xóa nội dung cũ trong bảng
  inforBody.innerHTML = '';

  // Hiển thị danh sách đã sắp xếp
  sortedNotifis.forEach(notifi => addRowNotifi(notifi));
}

// biểu đồ
function chart() {
  $('.content').style.display = 'none';
  $('.chart').style.display = 'flex';

  if (chartInstance) {
    chartInstance.destroy();
  }

  // Lấy lựa chọn của người dùng
  const chartOption = document.getElementById('chartOption').value;

  const ctx = document.getElementById('myChart').getContext('2d');

  if (!ctx) {
    console.error('Failed to get 2d context!');
    return;
  }

  // Kiểm tra và chuẩn bị dữ liệu cho biểu đồ
  let labels = [];
  let data = [];

  if (chartOption === 'emp') {
    // Xử lý xem theo nhân viên
    const errorCountByEmp = {};

    notifis.forEach(notifi => {
      const idEmp = notifi.idEmp;
      if (!errorCountByEmp[idEmp]) {
        errorCountByEmp[idEmp] = 0;
      }
      errorCountByEmp[idEmp] += 1;
    });

    labels = Object.keys(errorCountByEmp);  // idEmp
    data = Object.values(errorCountByEmp);  // Số lỗi của từng nhân viên
  } else if (chartOption === 'error') {
    // Xử lý xem theo lỗi
    const errorCountByError = {};

    notifis.forEach(notifi => {
      const errorName = errorsMap[notifi.idErr] || 'Không xác định';
      if (!errorCountByError[errorName]) {
        errorCountByError[errorName] = 0;
      }
      errorCountByError[errorName] += 1;
    });

    labels = Object.keys(errorCountByError);  // Tên lỗi
    data = Object.values(errorCountByError);  // Số lần lỗi xuất hiện
  }

  // Tạo biểu đồ mới với Chart.js
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,  // Các idEmp hoặc tên lỗi
      datasets: [{
        label: chartOption === 'emp' ? 'Số lỗi của nhân viên' : 'Số lần lỗi',
        data: data,  // Số lượng lỗi hoặc số lần lỗi
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',  // Màu của cột đầu tiên
          'rgba(54, 162, 235, 0.2)',  // Màu của cột thứ hai
          'rgba(255, 206, 86, 0.2)',  // Màu của cột thứ ba
          'rgba(75, 192, 192, 0.2)',  // Màu của cột thứ tư
          'rgba(153, 102, 255, 0.2)'  // Màu của cột thứ năm
          // Thêm màu cho các cột còn lại nếu cần
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',  // Viền cột đầu tiên
          'rgba(54, 162, 235, 1)',  // Viền cột thứ hai
          'rgba(255, 206, 86, 1)',  // Viền cột thứ ba
          'rgba(75, 192, 192, 1)',  // Viền cột thứ tư
          'rgba(153, 102, 255, 1)'  // Viền cột thứ năm
          // Thêm viền cho các cột còn lại nếu cần
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function exitChart() {
  $('.content').style.display = 'block';
  $('.chart').style.display = 'none';
}
