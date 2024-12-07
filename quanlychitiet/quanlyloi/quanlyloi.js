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
let errors = [];
let currentSortColumn = '';
let sortOrder = 'asc';

// hàm thêm hàng unit 
function addRowError(data) {

  const str = `
    <tr>
      <td class="body__action">
        <button class="btn btn--delete" onclick="deleteError(this)">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
      <td>${data.id}</td>
      <td>${data.domain}</td>
      </tr>
      `;
  inforBody.innerHTML += str;
}


async function fetchErrors() {
  try {

    const errorsObj = await allApi.fetchData(`rdp/api/v1/banned-domains/all-banned-domains`);
    if (errorsObj) {
      errors = errorsObj.data;
      // Gọi hàm để thêm từng phòng ban vào bảng
      errors.forEach(err => addRowError(err));
    }

  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu unit: ', error);
  }
}

// Gọi hàm để tải dữ liệu lúc đầu
document.addEventListener("DOMContentLoaded", fetchErrors);

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


// thêm lỗi
async function addError() {
  clearFormErrors();
  editForm.style.display = "block";
  $('.header__form').textContent = "Thêm lỗi";
  // formId.style.display = 'none';
  // document.querySelector("label[for='id']").style.display = "none";
  formName.value = '';

  const formValidator = new Validator('#form');
  btnHuy.onclick = exitEditForm;
  btnOk.onclick = null;

  btnOk.onclick = async function (event) {
    event.preventDefault();

    if (formValidator.validateForm()) {
      event.preventDefault(); // Ngăn chặn sự kiện gửi đi của form

      const newError = {
        domain: formName.value,
      };

      const response = await allApi.addData(`rdp/api/v1/banned-domains/banned-domain`, newError);
      if (response) {
        inforBody.innerHTML = '';
        fetchErrors();
        closeForm();
      }
    } else {
      console.log("Form không hợp lệ!");
    }
  };
}

// xóa phòng ban
async function deleteError(button) {
  const row = button.closest("tr");
  const id = row.cells[1].textContent;
  const isConfirmed = confirm("Bạn có chắc chắn muốn xóa lỗi này?");

  if (isConfirmed) {
    const response = await allApi.deleteData('rdp/api/v1/banned-domains/banned-domain', id);
    if (response) {
      row.remove();
    }
  }
}

async function turnOnOrOff(id) {
  const error = errors.find(err => err.id === id);

  if (error) {
    const isConfirmed = confirm("Bạn có chắc chắn muốn thay đổi trạng thái của lỗi này?");

    if (isConfirmed) {
      error.isOn = error.isOn === "true" ? "false" : "true";

      const checkbox = document.querySelector(`input[type="checkbox"][data-id="${id}"]`);
      if (checkbox) {
        checkbox.checked = error.isOn === "true";
      }
      const response = await allApi.updateData('errors', JSON.stringify({ name: error.name, isOn: error.isOn }));
    } else {
      const checkbox = document.querySelector(`input[type="checkbox"][data-id="${id}"]`);
      if (checkbox) {
        checkbox.checked = error.isOn === "true";
      }
    }


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
function searchError() {
  const searchTerm = document.getElementById('search').value.toLowerCase();

  inforBody.innerHTML = '';

  const filteredErorr = errors.filter(err => {
    return err.domain.toLowerCase().includes(searchTerm);
  });

  filteredErorr.forEach(err => addRowError(err));
}

$('.search').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    searchError();
  }
})

function sortError(column) {
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
  const sortedErrors = errors.sort((a, b) => {

    let compareA = a[column] || '';
    let compareB = b[column] || '';
    return (sortOrder === 'asc') ? compareA.localeCompare(compareB) : compareB.localeCompare(compareA);
  });

  // Xóa nội dung cũ trong bảng
  inforBody.innerHTML = '';

  // Hiển thị danh sách đã sắp xếp
  sortedErrors.forEach(err => addRowError(err));
}
