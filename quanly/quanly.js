
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const frame = $('.frame');
const btnEmployee  =$('.btn--employee')
const btnDepart  =$('.btn--depart')
const btnError  =$('.btn--error')
const btnNotify  =$('.btn--session')

function loadEmployee() {
  frame.src = '../quanlychitiet/quanlynhanvien/quanlynhanvien.html';
}

function loadDepart() {
  frame.src = '../quanlychitiet/quanlyphongban/quanlyphongban.html';
}

function loadError() {
  frame.src = '../quanlychitiet/quanlyloi/quanlyloi.html';
}

function loadSession() {
  frame.src = '../quanlychitiet/quanlyphienhoatdong/quanlyphienhoatdong.html';
}

btnEmployee.addEventListener('click', loadEmployee);
btnDepart.addEventListener('click', loadDepart);
btnError.addEventListener('click', loadError);
btnNotify.addEventListener('click', loadSession);