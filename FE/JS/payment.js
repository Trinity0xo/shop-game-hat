import { header, formatCurrency, alertFullil, alertFail } from "./header.js";
const $ = document.querySelector.bind(document);
const User = JSON.parse(localStorage.getItem("loginUser"));
const http = "http://localhost:8080/api/v1";
const token = User?.token;

function log(value) {
  console.log(`${value}: `, value);
}

// ========== get user information ========== //

async function getUser() {
  await fetch(`${http}/user/me`, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      authentication: User.token,
    },
    method: "get",
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.data === null) {
        alertFail();
      } else {
        localStorage.setItem(
          "loginUser",
          JSON.stringify({ data: data.data, token: token })
        );
      }
    });
}

// ========== update user information ========== //

async function updateUser(name, phone, address) {
  await fetch(`${http}/user/update-information`, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      authentication: User.token,
    },
    method: "put",
    body: JSON.stringify(name, phone, address),
  })
    .then((data) => data.json())
    .then((data) => {
      log(data);
    });
}

// ========== get cart ========== //

async function getCart() {
  await fetch(`${http}/cart`, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      authentication: User.token,
    },
    method: "get",
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.data === null) {
        renderProduct(data);
      } else {
        renderProduct(data);
      }
    });
}

// ========== create order ========== //

async function createOrder(data) {
  await fetch(`${http}/order`, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      authentication: User.token,
    },
    method: "post",
    body: JSON.stringify(data),
  })
    .then((data) => data.json())
    .then((data) => {
      if (!data.success) {
        alertFail(data?.message);
      } else {
        alertFullil(data?.message);
        window.location.replace("./thank.html");
      }
    });
}

// ========== create order with MoMo ========== //

async function orderMoMo(nextUrl, total) {
  await fetch(`${http}/order/MoMo`, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    method: "post",
    body: JSON.stringify({ nextUrl, total }),
  })
    .then((data) => data.json())
    .then((data) => {
      console.log(data);
      window.location.replace(data.data.payUrl);
    });
}

let total = 0;
function renderProduct(data) {
  if (data.data != null) {
    const html = data.data.products.map((val, index) => {
      let total = val.quantity * val.price;
      return `
            <div class="product">
                <img src="${val.img}" alt="">
                <div class="p-name">
                    <h4 class="name-product">${val.name}</h4>
                    <span class="quantity">X${val.quantity}</span>
                </div>
                <p class="p-total">${formatCurrency(total)}</p>
            </div>
            `;
    });
    $(".products").innerHTML = html.join("");
    $(".subtotal-detail").innerHTML = formatCurrency(data.data.total);
    total = data.data.total;
  } else {
    $(".products").innerHTML = " no product";
    $(".subtotal-detail").innerHTML = "0d";
  }
}

window.addEventListener("load", function () {
  getCart();
  header();
  getUser();
  if (User) {
    $("#u-name").value = User.data?.name;
    $("#u-name").setAttribute("disabled", "disabled");
    $("#u-email").value = User.data?.email;
    $("#u-email").setAttribute("disabled", "disabled");
    $("#u-phone").value = User.data?.phone ? `${User.data?.phone}` : "";
    $("#u-city").value = User.data?.city ? `${User.data.city}` : "";
    $("#u-district").value = User.data?.district ? `${User.data.district}` : "";
    $("#u-ward").value = User.data?.wards ? `${User.data.wards}` : "";
    $("#u-street").value = User.data?.streetAndHouseNumber
      ? `${User.data.streetAndHouseNumber}`
      : "";
  }

  const form = $(".f-checkout");
  form.addEventListener("submit", function (e) {
    const name = this.elements["name"].value;
    const phone = this.elements["phone"].value;
    const email = this.elements["email"].value;
    const city = this.elements["city"].value;
    const district = this.elements["district"].value;
    const wards = this.elements["ward"].value;
    const streetAndHouseNumber = this.elements["street"].value;
    e.preventDefault();
    const dataAdressUser = {
      name,
      phone,
      email,
      city,
      district,
      wards,
      streetAndHouseNumber,
    };
    log(dataAdressUser);
    createOrder(dataAdressUser);
  });

  const momo = $(".btn-MOMO-submit");
  momo.addEventListener("click", function (e) {
    e.preventDefault();
    const phone = $("#u-phone").value;
    const city = $("#u-city").value;
    const district = $("#u-district").value;
    const wards = $("#u-ward").value;
    const streetAndHouseNumber = $("#u-street").value;
    const dataAdressUser = {
      phone,
      city,
      district,
      wards,
      streetAndHouseNumber,
    };

    if (!phone || !city || !district || !wards || !streetAndHouseNumber) {
      alertFail("vui lòng điền thông tin đầy đủ");
    } else {
      const url = "http://127.0.0.1:5500/FE/thank.html";
      orderMoMo(url, total);
      localStorage.setItem(
        "Momo",
        JSON.stringify({ isMomo: true, total, data: dataAdressUser })
      );
    }
  });
});
