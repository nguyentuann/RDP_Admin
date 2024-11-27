const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const app = {
  screenFocus: function () {
    const screens = $$('.screen');
    screens.forEach(screen => {
      screen.onclick = () => {
        screens.forEach(s => {
          if (screen !== s) {
            s.style.display = 'none';
          }
        });
        screen.classList.add('screen--focus');
        // addEventListenersToFocusedScreen();
      };
    });
  },

  // Hàm thêm màn hình mới
  addScreen: function (id) {

    const screenDiv = document.createElement('div');
    screenDiv.classList.add('screen');
    screenDiv.setAttribute('tabindex', '0');
    screenDiv.innerHTML = `<video class="screen__img screen__${id}" autoplay playsinline> </video>`;

    // Tìm container và thêm màn hình vào trong container
    const container = $('.container');
    if (container) {
      container.appendChild(screenDiv);
    }

    this.screenFocus(); // Gọi để thiết lập sự kiện cho màn hình mới
    return screenDiv.querySelector('.screen__img'); // Trả về img vừa tạo
  },

  removeScreen: function (id) {
    // Tìm phần tử màn hình theo id
    const screen = document.querySelector(`.screen__${id}`);

    if (screen) {
      // Xóa phần tử screen chứa ảnh
      const screenDiv = screen.closest('.screen');
      if (screenDiv) {
        screenDiv.remove();
      }
    }
  },

  start: function () {
    this.screenFocus(); // Thiết lập sự kiện cho các phần tử ban đầu
  }
};

// xác thức form đăng nhập 

async function ValidateLogin(event) {
  event.preventDefault();
  const username = $('#username').value.trim();
  const password = $('#password').value.trim();
  try {
    // const data = await allApi.login(username, password, `authentication/login`);

    if (1) {
      renderContent();
      document.getElementById('btn-quanly').addEventListener('click', () => {
        window.electronAPI.sendOpenQuanLy();
      });
      $('.login-container').innerHTML = '';
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
    const data = await allApi.logout(`authentication/logout`);
    if (data) {
      console.log('Đăng xuất thành công:', data);

      localStorage.removeItem('token');
      console.log('Token đã bị xóa');

      renderLoginForm();
    } else {
      console.error('Đăng xuất thất bại.');
      alert('Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.');
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
        <button id="btn-quanly" class=" btn btn-quanly">Quản lý</button>
        <button class="btn btn-logout" onclick="mainLogout()">Đăng xuất</button>
      </div>

      <div class="main-content">
        <div class="container">
        </div>
      </div>
      <div class="footer"></div>`;
}

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