const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";

const users = JSON.parse(localStorage.getItem('friends')) || [];

const dataPanel = document.querySelector("#data-panel");
const modalPanel = document.querySelector("#modal-panel")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")

// Render Users
function renderUserList(data) {
  let rawHTML = "";

  data.forEach((item) => {
    // console.log(item)
    rawHTML += `
    <div class="col-sm-4 col-md-3 col-lg-2 mb-2">
        <div class="card" style="max-width: 180px">
          <img class="card-img-top" src="${item.avatar}" alt="Card image cap">
          <div class="card-body">
            <h6 class="card-name">${item.name + " " + item.surname}</h6>
            <a href="#" class="btn btn-info btn-show-info btn-sm d-flex justify-content-center" data-toggle="modal" data-target="#modal-panel" data-id="${
              item.id
            }">More Info</a>
          </div>
        </div>
      </div>
    `;
  });
  dataPanel.innerHTML = rawHTML;
}

// Render Modal
function showUserModal(id) {
  const modalName = document.querySelector("#user-modal-name");
  const modalGender = document.querySelector("#user-modal-gender");
  const modalAge = document.querySelector("#user-modal-age");
  const modalRegion = document.querySelector("#user-modal-region");
  const modalBirthday = document.querySelector("#user-modal-birthday");
  const modalEmail = document.querySelector("#user-modal-email");
  const btnAddFriend = document.querySelector((".btn-add-friend"))

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data;
    modalName.innerText = data.name + " " + data.surname;
    modalGender.innerText = `Gender: ${data.gender}`;
    modalAge.innerText = `Age: ${data.age}`;
    modalRegion.innerText = `Region: ${data.region}`;
    modalBirthday.innerText = `Birthday: ${data.birthday}`;
    modalEmail.innerText = `Contact me: ${data.email}`;
    btnAddFriend.setAttribute("data-id", `${data.id}`)
  });
}

// LocalStorage
function addFriend(id) {

  const list = JSON.parse(localStorage.getItem('friends')) || []
  // console.log(id)
  const friend = users.find(friend => friend.id === id)
  // console.log(friend.id)

  if (list.some(friend => friend.id === id)) {
    return alert('已經是朋友!')
  }

  list.push(friend)
  localStorage.setItem('friends', JSON.stringify(list))
}

// 監聽器綁定
dataPanel.addEventListener('click', function onPanelClick(event) {
  if (event.target.matches(".btn-show-info")) {
    // console.log(event.target.dataset)
    showUserModal(Number(event.target.dataset.id));
  }
});

modalPanel.addEventListener('click', function onModalClick(event) {
  if (event.target.matches(".btn-add-friend")) {
    console.log(event.target.dataset)
      addFriend(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  
  let filteredUsers= []
  filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(keyword) || user.surname.toLowerCase().includes(keyword)
    )
  
  if (filteredUsers.length === 0) {
    return alert(`Cannot find users with keyword: ${keyword}`)
  }

  renderUserList(filteredUsers)
})

console.log(users)
renderUserList(users)