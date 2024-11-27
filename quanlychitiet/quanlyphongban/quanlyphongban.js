const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const editForm = $('.form__edit');
const btnEdit = $('.btn--edit');
const contentForm = $('.content__form');
const inforBody = $('.infor__body');
const btnHuy = $('.btn--exit');
const btnOk = $('.btn--ok');

const formId = document.getElementById("id");
const formName = document.getElementById("name");

// khai báo biến toàn cục
let departments = [];
let currentSortColumn = '';
let sortOrder = 'asc';

// hàm thêm hàng department
function addRowDepartment(data) {
  const str = `
    <tr>
      <td class="body__action">
        <button class="btn btn--delete" onclick="deleteDepartment(this)">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
      <td>${data.id}</td>
      <td>${data.name}</td>
    </tr>
  `;
  inforBody.innerHTML += str;
}


async function fetchDepartments() {
  try {
    departments = await allApi.fetchData('departments');
    if (departments !== null) {
      // Gọi hàm để thêm từng phòng ban vào bảng
      departments.forEach(department => addRowDepartment(department));
    }

  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu department: ', error);
  }
}


// Gọi hàm để tải dữ liệu lúc đầu
document.addEventListener("DOMContentLoaded", fetchDepartments);

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


// thêm phòng ban
async function addDepartment() {
  clearFormErrors();
  editForm.style.display = "block";
  $('.header__form').textContent = "Thêm phòng ban";
  formId.style.display = 'none';
  document.querySelector("label[for='id']").style.display = "none";
  formName.removeAttribute("readonly");

  formName.value = '';

  const formValidator = new Validator('#form');
  btnHuy.onclick = exitEditForm;
  btnOk.onclick = null;

  btnOk.onclick = async function (event) {
    event.preventDefault();

    if (formValidator.validateForm()) {
      event.preventDefault(); // Ngăn chặn sự kiện gửi đi của form

      const newDepartment = {
        id: uuid.v4(), // Sử dụng uuid để tạo ID mới
        name: formName.value,
      };

      const data = await allApi.addData('departments', newDepartment);
      if (data) {
        addRowDepartment(newDepartment);
        closeForm();
      }
    } else {
      console.log("Form không hợp lệ!");
    }
  };
}

// xóa phòng ban
async function deleteDepartment(button) {
  const row = button.closest("tr");
  const id = row.cells[1].textContent;
  const isConfirmed = confirm("Bạn có chắc chắn muốn xóa phòng ban này?");

  if (isConfirmed) {  
    const data = await allApi.deleteData('departments', id);
    console.log(data);
  }
}


// thoát form
function exitEditForm(event) {
  event.preventDefault();
  var isExit = confirm('Bạn có chắc muốn hủy?');
  if (isExit) {
    editForm.style.display = "none";
  }
}

function closeForm() {
  editForm.style.display = "none";
}


// tìm kiếm phòng ban
function searchDepartments() {
  const searchTerm = document.getElementById('search').value.toLowerCase();

  inforBody.innerHTML = '';

  const filteredDepartments = departments.filter(department => {
    return department.name.toLowerCase().includes(searchTerm);
  });

  filteredDepartments.forEach(department => addRowDepartment(department));
}

$('.search').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    searchDepartments();
  }
})

function sortDepartments(column) {
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
  const sortedDepartments = departments.sort((a, b) => {

    let compareA = a[column] || '';
    let compareB = b[column] || '';
    return (sortOrder === 'asc') ? compareA.localeCompare(compareB) : compareB.localeCompare(compareA);
  });

  // Xóa nội dung cũ trong bảng
  inforBody.innerHTML = '';

  // Hiển thị danh sách đã sắp xếp
  sortedDepartments.forEach(department => addRowDepartment(department));
}
