
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const inforBody = $('.infor__body');
const id = 33;
let sessions = [
  {
    "id": "03047d95-db55-03ef-3727-23a201dad3ef",
    "startTime": "2024-12-02 22:58:22",
    "endTime": "2024-12-02 22:58:52",
    "sessionEvents": [
      {
        "id": "2561be2d-479d-4101-b77b-8edc5cf4ceda",
        "time": "2024-12-02 22:58:52",
        "author": "server",
        "title": "INFO",
        "content": "Disconnected successfully"
      },
      {
        "id": "fcc7d067-1418-432e-b391-ab7084adb32d",
        "time": "2024-12-02 22:58:22",
        "author": "server",
        "title": "INFO",
        "content": "Connected successfully"
      }
    ]
  },
  {
    "id": "065335d0-542b-591a-826f-d4253560e46b",
    "startTime": "2024-12-02 22:56:26",
    "endTime": "2024-12-02 22:57:16",
    "sessionEvents": [
      {
        "id": "19878d9d-afff-416d-8d69-f58bd83153e5",
        "time": "2024-12-02 22:57:16",
        "author": "server",
        "title": "INFO",
        "content": "Disconnected successfully"
      },
      {
        "id": "60881704-4343-4ded-b031-e5ddfb68d73b",
        "time": "2024-12-02 22:56:26",
        "author": "server",
        "title": "INFO",
        "content": "Connected successfully"
      }
    ]
  }];
let currentSortColumn = '';
let sortOrder = 'asc';
var sortedSessions;



function addRowSession(data, index) {
  console.log(index)
  const str = `
    <tr>
      <td>${data.startTime}</td>
      <td>${data.endTime}</td>
      <td><a onclick='detailSession(${index})'>Xem chi tiết</a></td>
    </tr>
  `;
  inforBody.innerHTML += str;
}


async function fecthSessions() {
  try {
    // sessions = await allApi.fetchData(`rdp/api/v1/session-logs/user/${id}`);
    if (sessions) {
      sessions.forEach((session, index) => addRowSession(session, index));
    }
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener("DOMContentLoaded", fecthSessions(id));



// hàm tìm kiếm
function searchSessions() {
  const searchOption = document.getElementById('searchOption').value;
  const searchTerm = document.getElementById('search').value.toLowerCase();
  console.log(searchTerm)
  inforBody.innerHTML = '';

  const filteredSessions = sessions.filter(session => {
    if (searchOption === 'startTime') {
      return session.startTime.toLowerCase().includes(searchTerm);
    } else if (searchOption === 'endTime') {
      return session.endTime.toLowerCase().includes(searchTerm);
    }
    return false;
  });

  filteredSessions.forEach(session => addRowSession(session));
  document.getElementById('search').value = ''
}

$('.search').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    searchUnit();
  }
})


// sắp xếp phiên
function sortSessions(column) {
  if (currentSortColumn === column) {
    sortOrder = (sortOrder === 'asc') ? 'desc' : 'asc';
  } else {
    sortOrder = 'asc';
  }

  currentSortColumn = column;

  sortedSessions = sessions.sort((a, b) => {
    let compareA, compareB;

    if (column === 'startTime' || column === 'endTime') {
      compareA = new Date(a[column]);
      compareB = new Date(b[column]);
      return (sortOrder === 'asc') ? compareA - compareB : compareB - compareA;
    }

    compareA = a[column];
    compareB = b[column];
    return (sortOrder === 'asc') ? compareA.localeCompare(compareB) : compareB.localeCompare(compareA);
  });

  inforBody.innerHTML = '';

  sortedSessions.forEach(session => addRowSession(session));
}
