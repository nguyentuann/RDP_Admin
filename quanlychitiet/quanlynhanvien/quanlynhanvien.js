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
const formId = document.getElementById("id");
const formName = document.getElementById("name");
const formEmail = document.getElementById("email");
const formPassword = document.getElementById("password");
const formDepartment = document.getElementById("department");
const formJobTitle = document.getElementById("jobTitle");
const formCompanyName = document.getElementById("companyName");

// Biến toàn cục
let departmentsMap = {};
let employees = [];
let currentSortColumn = '';
let sortOrder = 'asc';


// hàm thêm hàng nhân viên
function addRowEmployee(data) {
  const str = `
    <tr>
      <td class="body__action">
        <button class="btn btn--delete" onclick="deleteEmployee(this)">
          <i class="fa-solid fa-trash"></i>
        </button>
        <button class="btn btn--edit" onclick="editEmployee(this)">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
      </td>
      <td>${data.id}</td>
      <td>${data.name}</td>
      <td>${data.email}</td>
      <td>${data.password}</td>
      <td>${unitsMap[data.unit] || data.unit}</td> 
      <td>${data.part}</td>
      <td>${data.position}</td>
    </tr>
  `;
  inforBody.innerHTML += str;
}

// load dữ liệu lúc đầu
async function fetchDepartment() {
  try {

    const departments = await allApi.fetchData(`departments/all-departments`);

    // Chuyển đổi danh sách phòng ban thành một bản đồ với ID là key và name là value
    departments.forEach(department => {
      departmentsMap[department.id] = department.name;
    });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu đơn vị:', error);
  }
}

async function fetchEmployees() {
  try {
    await fetchUnits(); // Tải danh sách đơn vị trước

    employees = await allApi.fetchData(`users/all-users`);

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


async function departmentOptions() {
  const departmentSelect = document.getElementById('department');

  try {
    const departments = await allApi.fetchData(`departments/all-departments`);

    // Kiểm tra xem phản hồi có thành công không
    if (departments!==null) {
      // Duyệt qua từng đơn vị và thêm vào select
      departments.forEach(department => {
        const option = document.createElement('option');
        option.value = department.id; // Giá trị của option là ID
        option.textContent = department.name; // Văn bản hiển thị là tên đơn vị
        departmentSelect.appendChild(option);
      });
    } else {
      console.error('Lỗi khi tải danh sách đơn vị:', response.statusText);
    }
  } catch (error) {
    console.error('Lỗi khi gửi yêu cầu:', error);
  }
}

// Gọi hàm populateUnitOptions khi trang đã tải xong
document.addEventListener("DOMContentLoaded", populateUnitOptions);

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
  formId.style.display = 'none';
  document.querySelector("label[for='id']").style.display = "none";
  formName.removeAttribute("readonly");
  formEmail.removeAttribute("readonly");

  // Xóa các trường input
  formName.value = '';
  formEmail.value = '';
  formPassword.value = '';
  formUnit.value = formUnit.options[0].value;
  formPart.value = '';
  formPosition.value = '';

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
        id: uuid.v4(), // Sử dụng uuid để tạo ID mới
        name: formName.value,
        email: formEmail.value,
        password: formPassword.value,
        unit: formUnit.value,
        part: formPart.value,
        position: formPosition.value
      };

      const employee = await allApi.addData('employees', newEmployee);
      addRowEmployee(employee);

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
  const password = row.cells[4].textContent;
  const unit = row.cells[5].textContent;
  const part = row.cells[6].textContent;
  const position = row.cells[7].textContent;

  // Điền dữ liệu vào form
  formId.value = id;
  formName.value = name;
  formEmail.value = email;
  formPassword.value = password;
  formUnit.value = Object.keys(unitsMap).find(key => unitsMap[key] === unit);
  formPart.value = part;
  formPosition.value = position;

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
        id: id,
        name: formName.value,
        email: formEmail.value,
        password: formPassword.value,
        unit: formUnit.value,
        part: formPart.value,
        position: formPosition.value
      };

      // var xhttp = new XMLHttpRequest();
      // xhttp.open('PUT', `http://localhost:3000/employees/${id}`, true);
      // xhttp.setRequestHeader('Content-Type', 'application/json');

      const data = await allApi.updateData('employees', updatedEmployee.id, updatedEmployee);
      if (data) {
        row.cells[2].textContent = updatedEmployee.name;
        row.cells[3].textContent = updatedEmployee.email;
        row.cells[4].textContent = updatedEmployee.password;
        row.cells[5].textContent = unitsMap[updatedEmployee.unit]; // Hiển thị tên đơn vị
        row.cells[6].textContent = updatedEmployee.part;
        row.cells[7].textContent = updatedEmployee.position;

        // Đóng form chỉnh sửa
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
    const data = await allApi.deleteData('employees', id);
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
    } else if (searchOption === 'department') {
      const unitName = unitsMap[employee.unit];
      return unitName && unitName.toLowerCase().includes(searchTerm);
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
    let compareA, compareB;

    // Kiểm tra cột nào đang được sắp xếp
    if (column === 'unit') {
      compareA = unitsMap[a.unit] || '';
      compareB = unitsMap[b.unit] || '';
    } else {
      // Đối với các cột còn lại, bao gồm "Mã nhân viên"
      compareA = a[column] || '';
      compareB = b[column] || '';
    }

    // Sử dụng localeCompare để sắp xếp chuỗi, hoặc so sánh số nếu là mã nhân viên
    if (column === 'id') { // Nếu cột là mã nhân viên, so sánh số
      return (sortOrder === 'asc') ? (a.id - b.id) : (b.id - a.id);
    } else {
      return (sortOrder === 'asc') ? compareA.localeCompare(compareB) : compareB.localeCompare(compareA);
    }
  });

  // Xóa nội dung cũ trong bảng
  inforBody.innerHTML = '';

  // Hiển thị danh sách đã sắp xếp
  sortedEmployees.forEach(employee => addRowEmployee(employee));
}


