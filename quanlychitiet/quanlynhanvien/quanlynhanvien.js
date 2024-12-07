const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const editForm = $('.form__edit');
const btnEdit = $('.btn--edit');
const contentForm = $('.content__form');
const inforBody = $('.infor__body');
const btnOk = $('.btn--ok');
const btnHuy = $('.btn--exit');

/**
 * id, email, password, name, jobTitle, avatar, companyName
 */



// các trường của form
const formName = document.getElementById("name");
const formEmail = document.getElementById("email");
const formUsername = document.getElementById("username");
const formPassword = document.getElementById("password");
const formJobTitle = document.getElementById("jobTitle");
const formCompanyName = document.getElementById("companyName");

// Biến toàn cục
let employees = [];
let currentSortColumn = '';
let sortOrder = 'asc';


// hàm thêm hàng nhân viên
function addRowEmployee(data) {
  const str = `
    <tr>
      <td class="body__action">
        <button class="btn btn--delete" onclck="deleteEmployee(this)">
          <i class="fa-solid fa-trash"></i>
        </button>
        <button class="btn btn--edit" onclick="editEmployee(this)">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
      </td>
      <td>${data.id}</td>
      <td>${data.name}</td>
      <td>${data.email}</td>
      <td>${data.username}</td>
      <td>${data.password}</td>
      <td>${data.jobTitle}</td> 
      <td>${data.companyName}</td>
    </tr>
  `;
  inforBody.innerHTML += str;
}

async function fetchEmployees() {
  try {

    const employeesObj = await allApi.fetchData(`rdp/api/v1/users/all-users`);
    console.log(employeesObj)
    employees = employeesObj.data;

    if (employees !== null) {
      // Gọi hàm để thêm từng nhân viên vào bảng
      employees.forEach(employee => addRowEmployee(employee));
    }
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu nhân viên:', error);
  }
}

// Gọi hàm để tải dữ liệu lúc đầu
document.addEventListener("DOMContentLoaded", fetchEmployees);

// Hàm xóa form
function clearFormErrors() {
  const formGroups = document.querySelectorAll('.form__edit .form__group');
  formGroups.forEach(formGroup => {
    formGroup.classList.remove('invalid');
    const errorMessage = formGroup.querySelector('.form-message');
    if (errorMessage) {
      errorMessage.innerText = '';
    }
  });
}


// thêm nhân viên
async function addEmployee() {
  clearFormErrors();
  editForm.style.display = "block";
  $('.header__form').textContent = "Thêm nhân viên";

  const formGroups = document.querySelectorAll('.form__group');

  formGroups.forEach((formGroup) => {
    const input = formGroup.querySelector('input');
    const buttonGroup = formGroup.querySelector('.btn'); 

    if (buttonGroup) {
      return; 
    }
    if (input && (input.id === 'username' || input.id === 'password')) {
      input.removeAttribute('readonly');
    } else {
      formGroup.remove();
    }
  });

  formUsername.value = '';
  formPassword.value = '';

  // Khởi tạo validator chỉ một lần
  const formValidator = new Validator('#form');

  btnHuy.onclick = exitEditForm;
  // Xóa sự kiện `onclick` cũ của `btnOk` nếu có
  btnOk.onclick = null;

  // Đặt sự kiện `onclick` mới
  btnOk.onclick = async function (event) {
    event.preventDefault();

    // Kiểm tra tính hợp lệ của form
    if (formValidator.validateForm()) {
      event.preventDefault(); // Ngăn chặn sự kiện gửi đi của form

      const newEmployee = {
        username: formUsername.value,
        password: formPassword.value,
      };

      const employee = await allApi.addData('rdp/api/v1/users/user', newEmployee);
      if(employee) {
        inforBody.innerHTML = ''
        fetchEmployees();
        closeForm();
      }

    } else {
      console.log("Form không hợp lệ!");
    }
  };
}

// Hàm chỉnh sửa nhân viên
async function editEmployee(button) {
  clearFormErrors();
  editForm.style.display = "block";
  $('.header__form').textContent = "Thay đổi thông tin nhân viên";

  const row = button.closest("tr");
  const id = row.cells[1].textContent;
  const name = row.cells[2].textContent;
  const email = row.cells[3].textContent;
  const username = row.cells[4].textContent;
  const password = row.cells[5].textContent;
  const jobTitle = row.cells[6].textContent;
  const companyName = row.cells[7].textContent;

  // Điền dữ liệu vào form
  formName.value = name;
  formEmail.value = email;
  formUsername.value = username
  formPassword.value = password;
  formJobTitle.value = jobTitle;
  formCompanyName.value = companyName;

  // Khởi tạo validator chỉ một lần
  const formValidator = new Validator('#form');

  btnHuy.onclick = exitEditForm;
  // Xóa sự kiện `onclick` cũ của `btnOk` nếu có
  btnOk.onclick = null;

  // Đặt sự kiện `onclick` mới
  btnOk.onclick = async function (event) {
    event.preventDefault();
    // Kiểm tra tính hợp lệ của form
    if (formValidator.validateForm()) {
      console.log(formValidator.validateForm());
      const updatedEmployee = {
        name: formName.value,
        email: formEmail.value,
        password: formPassword.value,
        jobTitle: formJobTitle.value,
        avatar: "",
        companyName: formCompanyName.value,
      };

      const data = await allApi.updateData('rdp/api/v1/users/user', id, updatedEmployee);
      if (data) {
        inforBody.innerHTML = '';
        fetchEmployees();
        closeForm();
      }
    } else {
      console.log("Form không hợp lệ!");
    }
  };
}

// xóa nhân viên
async function deleteEmployee(button) {
  const row = button.closest("tr");
  const id = row.cells[1].textContent;
  const isConfirmed = confirm("Bạn có chắc chắn muốn xóa phòng ban này?");
  if (isConfirmed) {
    const data = await allApi.deleteData('rdp/api/v1/users/user', id);
  }
}

// thoát form
function exitEditForm(event) {
  event.preventDefault();
  var isExit = confirm('Bạn có chắc muốn hủy?');
  if (isExit) {
    closeForm();
  }
}


function closeForm() {
  editForm.style.display = "none";
}
// tìm kiếm nhân viên
function searchEmployees() {
  const searchOption = document.getElementById('searchOption').value;
  const searchTerm = document.getElementById('search').value.toLowerCase();

  inforBody.innerHTML = '';

  const filteredEmployees = employees.filter(employee => {
    if (searchOption === 'name') {
      return employee.name.toLowerCase().includes(searchTerm);
    } else if (searchOption === 'email') {
      return employee.email.toLowerCase().includes(searchTerm);
    }
    return false;
  });

  filteredEmployees.forEach(employee => addRowEmployee(employee));
}

$('.search').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    searchUnit();
  }
})

function sortEmployees(column) {
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
  const sortedEmployees = employees.sort((a, b) => {
    const compareA = a[column] || '';
    const compareB = b[column] || '';

    // Sử dụng localeCompare để sắp xếp chuỗi
    // return (sortOrder === 'asc')
    //   ? compareA.localeCompare(compareB)
    //   : compareB.localeCompare(compareA);

    if (typeof compareA === 'number' && typeof compareB === 'number') {
      // Sắp xếp số
      return (sortOrder === 'asc') ? compareA - compareB : compareB - compareA;
    } else {
      // Sắp xếp chuỗi (xử lý undefined/null)
      const valueA = compareA ? compareA.toString() : '';
      const valueB = compareB ? compareB.toString() : '';
      return (sortOrder === 'asc')
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
  });

  // Xóa nội dung cũ trong bảng
  inforBody.innerHTML = '';

  // Hiển thị danh sách đã sắp xếp
  sortedEmployees.forEach(employee => addRowEmployee(employee));
}




