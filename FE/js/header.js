const $ = document.querySelector.bind(document);
const User = JSON.parse(localStorage.getItem("loginUser"));
const alertSuccess = $(".alert-primary");
const alertDanger = $(".alert-danger");

export function header() {
  //show user
  if (User) {
    const showUser = $(".user");
    showUser.innerHTML = `<i class="fa-solid fa-user"></i> ${User.data?.name}
        <ul class="dropdown-user">
        <li class="profile">
          <div class="btn-group dropstart">
            <button type="button" class=" dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              Thông tin tài khoản
            </button>
            <ul class="dropdown-menu">
              <li>${User.data?.name}</li>
              <li>${User.data?.email}</li>
              <li style="display:none">
                <div class="btn-group dropstart">
                  <button type="button" class="btn btn-secondary dropdown-toggle edit-profile" data-bs-toggle="dropdown" aria-expanded="false">
                    Thông tin cá nhân
                  </button>
                  <ul class="dropdown-menu">
                    Edit
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </li>
        <li class="purchase"><a href="./purchase.html" >Đơn hàng</a></li>
        <li class="logout">Đăng xuất</li>
    </ul>
        `;

    // button logout
    const logoff = $(".logout");
    logoff.addEventListener("click", function () {
      localStorage.removeItem("loginUser");
      window.location.replace("./index.html");
    });
    const editUser = $(".edit-profile");
    editUser.addEventListener("click", function () {
      window.location.replace("./userProfile.html");
    });
  }
}

//alert
export function alertFullil(message = "success", time = 1500) {
  alertSuccess.children[0].textContent = `${message}`;
  alertSuccess.classList.add("get-active");
  setTimeout(() => {
    alertSuccess.classList.remove("get-active");
  }, time);
}

export function alertFail(message = "Something fail!", time = 1500) {
  alertDanger.children[0].textContent = `${message}`;
  alertDanger.classList.add("get-active");
  setTimeout(() => {
    alertDanger.classList.remove("get-active");
  }, time);
}

//format currency
export function formatCurrency(price, symbol = "đ") {
  var DecimalSeparator = Number("1.2").toLocaleString().substr(1, 1);
  var priceWithCommas = price.toLocaleString();
  var arParts = String(priceWithCommas).split(DecimalSeparator);
  var intPart = arParts[0];
  var decPart = arParts.length > 1 ? arParts[1] : "";
  decPart = (decPart + "000").substr(0, 3);
  return intPart + symbol;
}
