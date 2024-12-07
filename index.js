const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);



var isCall = false;
const app = {
  screenFocus: function () {
    const screens = $$('.staff');
    screens.forEach(screen => {
      screen.onclick = () => {
        screens.forEach(s => {
          if (screen !== s) {
            s.style.display = 'none';
          }
        });
        screen.classList.add('screen--focus');
        if (!isCall) {
          addEventListenersToFocusedScreen();
          isCall = !isCall;
        }
      };
    });
    const btnBack = $('.btn-back')
    const btnUnFocus = $('.btn-unfocus')
    btnBack.style.display = 'none'
    btnUnFocus.style.display = 'block'
  },


  screenUnFocus: function () {
    const screens = $$('.staff');
    screens.forEach(screen => {
      screen.style.display = 'block';
      screen.classList.remove('screen--focus');
    });

    if (isCall) {
      isCall = !isCall;
    }
    const btnBack = $('.btn-back')
    const btnUnFocus = $('.btn-unfocus')
    btnUnFocus.style.display = 'none'
    btnBack.style.display = 'block'
  },


  back: function () {
    renderDepartment();
    const btnBack = document.querySelector('#btn-back');
    if (btnBack) {
      btnBack.style.display = 'none';
    }
  },

  // Hàm thêm màn hình mới
  addScreen: function (id) {
    const staff = document.querySelector(`.staff_${id}`);
    staff.innerHTML = ``;
    const screenDiv = document.createElement('div');
    screenDiv.classList.add('screen');
    screenDiv.setAttribute('tabindex', '0');
    screenDiv.innerHTML = `<video class="screen__img screen__${id}" autoplay playsinline></video>`;

    // Tìm container và thêm màn hình vào trong container
    const container = $('.container');
    if (container) {
      staff.appendChild(screenDiv);
    }
    screenDiv.addEventListener('click', () => app.screenFocus());
    // this.screenFocus(); // Thiết lập sự kiện cho màn hình mới
    return screenDiv.querySelector('.screen__img'); // Trả về img vừa tạo
  },

  addDepartmentScreen: function (department) {

    const screenDiv = document.createElement('div');
    screenDiv.classList.add('department', `department_${department.id}`);
    screenDiv.setAttribute('tabindex', '0');
    screenDiv.addEventListener('click', () => renderStaffInDepartment(`${department.id}`));
    screenDiv.addEventListener('click', () => startShared(`${department.id}`)); // phát sự kiện yêu cầu chia sẻ
    screenDiv.innerHTML = `
      <div>
        <h3>${department.name}</h3>
      </div>`;
    const container = $('.container');
    if (container) {
      container.appendChild(screenDiv);
    }
  },

  addStaffInDepartment: function (staff) {
    const container = document.querySelector('.container');
    const staffDiv = document.createElement('div');
    staffDiv.classList.add('staff', `staff_${staff.id}`);
    staffDiv.setAttribute('tabindex', '0');

    staffDiv.innerHTML = `
      <div class="staff_info">
        <div class="staff_avatar">
          <img src="${staff.avatar}" alt="${staff.name}'s Avatar" />
        </div>
        <h3 class="staff_name">${staff.name}</h3>
      </div>`;

    if (container) {
      container.appendChild(staffDiv);
    } else {
      console.error('Container element not found!');
    }
  },
};

// xác thức form đăng nhập 
async function ValidateLogin(event) {
  event.preventDefault();
  const username = $('#username').value.trim();
  const password = $('#password').value.trim();

  try {
    const data = await login(username, password, 'rdp/api/v1/authentication/login');

    if (data) {
      document.querySelector('.main-container').style.display = 'block';
      renderContent();
      document.getElementById('btn-quanly').addEventListener('click', () => {
        window.electronAPI.sendOpenQuanLy();
      });
      $('.login-container').innerHTML = '';
      $('.login-container').remove();
      renderDepartment();
    } else {
      $$('.form__group').forEach(group => group.classList.add('invalid'));
      $('.login-message').classList.add('invalid');
      $('.login-message').innerText = 'Tên đăng nhập hoặc mật khẩu không chính xác.Vui lòng thử lại'
    }
  } catch (error) {
    console.log(error)
  }
  const formGroups = $$('.form__group');
  formGroups.forEach(group => {
    const input = group.querySelector('input');
    if (input) {
      input.oninput = handleClearError;
    }
  });
}

function handleClearError(event) {
  const formGroups = $$('.form__group');
  formGroups.forEach((formGroup) => {
    if (formGroup.classList.contains('invalid')) {
      $(formGroup.classList.remove('invalid'))
    }
  })
  var formMessage = $('.login-message');
  if (formMessage) {
    formMessage.innerText = '';
  }
}

$('#username').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    $('.btn--login').click();
  }
})

$('#password').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    $('.btn--login').click();
  }
})

// Đăng xuất
async function mainLogout() {

  const confirmLogout = confirm("Bạn có chắc chắn muốn đăng xuất không?");
  if (!confirmLogout) return;
  try {
    const data = await logout(`rdp/api/v1/authentication/logout`);
    if (data) {
      console.log('Đăng xuất thành công:', data);

      localStorage.removeItem('token');
      console.log('Token đã bị xóa');

      renderLoginForm();
    } else {
      console.error('Đăng xuất thất bại.');
    }
  } catch (error) {
    console.error('Lỗi trong quá trình đăng xuất:', error);
    alert('Không thể đăng xuất. Vui lòng kiểm tra lại kết nối mạng.');
  }
}

// xuất nội dung 
function renderContent() {
  $('.main-container').innerHTML = `
      <div class="header">
        <button id="btn-back" class="btn btn-back" onclick = "app.back()">Quay lại</button>
        <button id="btn-unfocus" class="btn btn-unfocus" onclick = "app.screenUnFocus()">Quay lại</button>
        <button id="btn-quanly" class="btn btn-quanly">Quản lý</button>
        <button class="btn btn-logout" onclick="mainLogout()">Đăng xuất</button>
      </div>

      <div class="main-content">
        <div class="container">
        </div>
      </div>`
}

// <div class="footer"></div>`;
// xuất form login
function renderLoginForm() {
  $('.main-container').innerHTML = '';
  $('.login-container').innerHTML = `
   <div class="login-content">
      <h2>Đăng Nhập</h2>
      <form method="get" id="loginForm">
        <div class="form__group">
          <label for="username">Tên đăng nhập:</label>
          <input type="text" id="username" name="username" required placeholder="Tên đăng nhập">
        </div>
        <div class="form__group">
          <label for="password">Mật khẩu:</label>
          <input type="password" id="password" name="password" required placeholder="Mật khẩu">
        </div>
        <span class="login-message"></span>
        <button type="submit" class="btn btn--login" onclick="ValidateLogin(event)">Đăng Nhập</button>
      </form>
    </div>`;
}

function renderDepartment() {
  document.querySelector('.container').innerHTML = '';
  // const departments = fetchDepartments();
  const departments = [
    {
      "id": 1,
      "name": "Phong A"
    },
    {
      "id": 2,
      "name": "Phong B"
    },
    {
      "id": 3,
      "name": "Phong C"
    },
    {
      "id": 4,
      "name": "Phong D"
    },
    {
      "id": 5,
      "name": "Phong E"
    },
    {
      "id": 6,
      "name": "Phong F"
    }
  ]
  departments.forEach(department => {
    app.addDepartmentScreen(department);
  })
}



async function renderStaffInDepartment(id) {
  console.log('add back trong renderstaffindepartment')
  // const staffs = await fetchStafsfInDepartment('4');
  // console.log(staffs)
  const staffs = [
    {
      "id": 1,
      "name": "nguyen le nhat tuan",
      "avatar": "https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/469116227_887242750255297_1137131770995992515_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHODLj1oGkMNjtRLz1mZG8j9pHEhKyi37f2kcSErKLftwqKHFakRXI63P4p-aCV56SUBw7mmgjwvJ7XvQX8-sGh&_nc_ohc=QLNTQnxpEZoQ7kNvgHOL3Iz&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=AuxQKI6PGvTd89b1rri1grN&oh=00_AYAy7KMSiObIBA2j-VbJUuuZ4fYUQXZul7x95hNuy_s6tg&oe=6753372F"
    },
    {
      "id": 2,
      "name": "bao",
      "avatar": "https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/469116227_887242750255297_1137131770995992515_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHODLj1oGkMNjtRLz1mZG8j9pHEhKyi37f2kcSErKLftwqKHFakRXI63P4p-aCV56SUBw7mmgjwvJ7XvQX8-sGh&_nc_ohc=QLNTQnxpEZoQ7kNvgHOL3Iz&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=AuxQKI6PGvTd89b1rri1grN&oh=00_AYAy7KMSiObIBA2j-VbJUuuZ4fYUQXZul7x95hNuy_s6tg&oe=6753372F"
    },
    {
      "id": 33,
      "name": "truong",
      "avatar": "https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/469116227_887242750255297_1137131770995992515_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHODLj1oGkMNjtRLz1mZG8j9pHEhKyi37f2kcSErKLftwqKHFakRXI63P4p-aCV56SUBw7mmgjwvJ7XvQX8-sGh&_nc_ohc=QLNTQnxpEZoQ7kNvgHOL3Iz&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=AuxQKI6PGvTd89b1rri1grN&oh=00_AYAy7KMSiObIBA2j-VbJUuuZ4fYUQXZul7x95hNuy_s6tg&oe=6753372F"
    },

  ]
  const container = document.querySelector('.container');
  if (container) {
    container.innerHTML = ``;
  }
  staffs.forEach(staff => {
    app.addStaffInDepartment(staff);
  })
  const btnBack = $('.btn-back')
  btnBack.style.display = 'block';
}

async function fetchDepartments() {
  try {
    const departments = await allApi.fetchData(`rdp/api/v1/departments/all-departments`);
    if (departments !== null) {
      return departments;
    }

  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu department: ', error);
  }
}

async function fetchStafsfInDepartment(id) {
  try {
    const staffs = await allApi.fetchData(`rdp/api/v1/departments/members-in-department/${id}`);
    if (staffs !== null) {
      return staffs.data;
    }

  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu staff: ', error);
  }
}



function back() {
  renderDepartment();
  const btnBack = document.querySelector('#btn-back');
  if (btnBack) {
    btnBack.style.display = 'none';
  }
}
