import { alertFullil, alertFail } from "./header.js";

// slide form
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");
const $ = document.querySelector.bind(document);
const alertSuccess = $(".alert-primary");
const alertDanger = $(".alert-danger");
const formSignin = $(".get-signin");
const http = "http://localhost:8080/api/v1";
let isEmail = "";
let isCheckEmail = false;
signUpButton.addEventListener("click", () => {
  $(".sign-up-container").innerHTML = htmlSignUp;
  container.classList.add("right-panel-active");

  const formSignup = $(".get-signup");
  formSignup.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = $(".r-email").value;
    const name = $(".r-username").value;
    const password = $(".r-password").value;
    const confirm = $(".confirm").value;
    if (password === confirm) {
      const data = {
        name,
        email,
        password,
      };
      register(data);
    } else {
      alertDanger.children[0].textContent = "Mật khẩu không khớp!";
      alertDanger.classList.add("get-active");
      setTimeout(() => {
        alertDanger.classList.remove("get-active");
      }, 3000);
    }
  });
});

signInButton.addEventListener("click", () => {
  if (isEmail && isCheckEmail) {
    const resendHtml = `<a class="re-send" href="#">Gửi lại email xác nhận?</a>`;
    forgot.insertAdjacentHTML("beforebegin", resendHtml);
    const btnReSend = $(".re-send");
    btnReSend.addEventListener("click", () => {
      resendVerify(isEmail);
    });
    isCheckEmail = false;
  }
  container.classList.remove("right-panel-active");
});

const forgot = $(".forgot");
const htmlForgot = `
        <label>
            <input type="text" class="f-token" placeholder="Nhập key xác nhận" pattern=".{4,}"
                title="Bốn ký tự trở lên" />
        </label>
        <label>
            <input type="password" class="f-password" placeholder="Mật khẩu"
                
                title="Phải chứa ít nhất một số và một chữ hoa và chữ thường, và ít nhất 8 ký tự trở lên" />
        </label>
        <label>
            <input type="password" class="f-confirm" placeholder="Xác nhận mật khẩu" />
        </label>
        <button class="btn-submit-register" style="margin-top: 9px">Lấy lại mật khẩu</button>

`;
const htmlSignUp = `
      <form class="get-signup" autocomplete="on" action="#">
          <h1>Đăng ký</h1>
          <div class="social-container">
          </div>
          <span></span>
          <label>
              <input type="text" class="r-username" placeholder="Họ tên" pattern=".{4,30}"
                  title="Bốn ký tự trở lên và tối đa 30 ký tự" required/>
          </label>
          <label>
              <input type="email" class="r-email" placeholder="Email" required/>
          </label>
          <label>
              <input type="password" class="r-password" placeholder="Mật khẩu"
                  
                  title="Phải chứa ít nhất một số và một chữ hoa và chữ thường, và ít nhất 8 ký tự trở lên" required/>
          </label>
          <label>
              <input type="password" class="confirm" placeholder="Xác nhận mật khẩu" required/>
          </label>
          <button class="btn-submit-register" style="margin-top: 9px">Đăng ký</button>
      </form>
`;
const htmlSendEmail = `
    <form class="get-forgot" autocomplete="on" action="#">
        <h1>Quên mật khẩu</h1>
        <div class="social-container">
        </div>
        <span></span>
        <label>
            <input type="email" class="f-email" placeholder="Email" />
        </label>
        <button class="btn-send" style="margin-top: 9px">Gửi email xác nhận</button>  
    </form>
`;

// ========== forgot password ========= //

forgot.addEventListener("click", function (e) {
  signUpButton.click();
  $(".sign-up-container").innerHTML = htmlSendEmail;
  const fForgot = $(".get-forgot");
  fForgot.addEventListener("submit", async function (e) {
    e.preventDefault();
    const btnSend = $(".btn-send");
    if (btnSend) {
      const email = $(".f-email").value;
      await fetch(`${http}/auth/forget-password`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
        .then((data) => data.json())
        .then((data) => {
          if (!data.success) {
            alertFail(data.message);
          } else {
            alertFullil(data.message, 4000);
            btnSend.setAttribute("disabled", "disabled");
            btnSend.insertAdjacentHTML("afterend", htmlForgot);
            btnSend.remove();
            $(".f-email").setAttribute("disabled", "disabled");
          }
        })
        .catch((err) => {
          alertFail(err);
        });
    }
    const resetToken = $(".f-token").value;
    const password = $(".f-password").value;
    const confirmPassword = $(".f-confirm").value;
    resetPassword(resetToken, password, confirmPassword);
  });
});

// ========== reset password ========= //

function resetPassword(resetToken, password, confirmPassword) {
  fetch(`${http}/auth/reset-password`, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    method: "put",
    body: JSON.stringify({ resetToken, password, confirmPassword }),
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.success) {
        alertFullil(data.message);
        signInButton.click();
      } else {
        alertFail(data.message, 2000);
      }
    })
    .catch(() => {
      alertFail();
    });
}

// ========== resend verify link ========= //

async function resendVerify(email) {
  await fetch(`${http}/auth/resend-verify-link"`, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    method: "post",
    body: JSON.stringify({ email }),
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.success) {
        alertFullil(data.message);
      } else {
        alertFail(data.message);
      }
    });
}

// ========== login ========= //

async function login(data) {
  await fetch(`${http}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        alertDanger.children[0].textContent = `${data.message}`;
        alertDanger.classList.add("get-active");
        setTimeout(() => {
          alertDanger.classList.remove("get-active");
        }, 2000);
      } else {
        localStorage.setItem(
          "loginUser",
          JSON.stringify({ data: data.data, token: data.token })
        );
      }

      // checkAdmin
      const User = JSON.parse(localStorage.getItem("loginUser"));
      if (User.data?.isAdmin) {
        window.location.replace("./admin.html");
      } else {
        window.location.replace("./index.html");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alertDanger.classList.add("get-active");
      setTimeout(() => {
        alertDanger.classList.remove("get-active");
      }, 2000);
    });
}

// ========== register ========= //

async function register(data) {
  try {
    await fetch(`${http}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => {
        if (!response.success) {
          alertDanger.children[0].textContent = `${response.message}`;
          alertDanger.classList.add("get-active");
          setTimeout(() => {
            alertDanger.classList.remove("get-active");
          }, 3000);
        } else {
          alertSuccess.children[0].textContent = `Đăng ký thành công,bạn cần xác minh tài khoản trước khi đăng nhập nhé`;
          alertSuccess.classList.add("get-active");
          setTimeout(() => {
            alertSuccess.classList.remove("get-active");
          }, 3000);
          isEmail = data.email;
          isCheckEmail = true;
          signInButton.click();

          // Confirm SIGN_IN
          $(".l-email").value = data.email;
          $(".l-password").value = data.password;

          // clear SiGN_UP
          $(".r-email").value = "";
          $(".r-username").value = "";
          $(".r-password").value = "";
          $(".confirm").value = "";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.log(error);
    alertDanger.classList.add("get-active");
    setTimeout(() => {
      alertDanger.classList.remove("get-active");
    }, 2000);
  }
}

window.addEventListener("load", function (e) {
  formSignin.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = $(".l-email").value;
    const password = $(".l-password").value;
    console.log(email, password);
    const data = {
      email,
      password,
    };
    login(data);
  });
});
