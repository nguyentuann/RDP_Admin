const container = $('.container');

function detailSession(index) {
  const session = sessions[index]
  console.log(session)
  var content = `
    <div class="header">
      <div>Thông báo</div>
      <div class="search__container">
        <select id="searchOption" class="search__option">
          <option value="time">Thời gian</option>
          <option value="content"></option>
        </select>
        <input type="text" name="search" id="search" class="search" placeholder="Nhập nội dung tìm kiếm">
        <button class="btn btn--search" onclick="searchSessions()">Tìm</button>
      </div>
    </div>

    <div class="content">

      <!-- infor -->
      <div class="content__infor">
        <table>
          <!-- header infor -->
          <thead class="infor__header">
            <tr>
              <th onclick="sortDetail('time')" class="column--time">Thời gian </th>
              <th class="column--content">Tiêu đề</th>
              <th class="column--content">Nội dung</th>
            </tr>
          </thead>
          <!-- content infor -->
          <tbody class="infor__body">
          ${detailContent(session.sessionEvents)}
          </tbody>
        </table>
      </div>
    </div>
  `;
  container.innerHTML = '';
  container.innerHTML = content;
}

function detailContent(sessionEvents) {
  let content = ''; 
  sessionEvents.forEach(event => {
    content += `
      <tr>
        <td>${event.time}</td>
        <td>${event.title}</td>
        <td>${event.content}</td>
      </tr>
    `;
  });
  return content; 
}
