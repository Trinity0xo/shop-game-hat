const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const User = JSON.parse(localStorage.getItem("loginUser"));
const http = "http://localhost:8080/api/";
const userID = User?.data.idUser;

function getSearchParameters() {
    var prmstr = window.location.search.substring(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
  }
  function transformToAssocArray(prmstr) {
    var params = {};
    var prmarr = prmstr.split("&");
    for (var i = 0; i < prmarr.length; i++) {
      var tmparr = prmarr[i].split("=");
      params[tmparr[0]] = tmparr[1];
    }
    return params;
  }

function renderContent (data){
    const html_img=`<img class="img-fluid details-img" src="${data.img}" alt="">`
    const html_name = `                          
    <p class="product-category mb-0">${data.manufacturer}</p>
    <h3>${data.name}</h3>
    <hr>
    <p class="product-price">${data.price}</p>`
    const html_description = `                            
    <p class="product-title mt-4 mb-1">About this product</p>
    <p class="product-description mb-4">
    ${data.description}
    </p>`
    $(".image").innerHTML = html_img;
    $(".description").innerHTML = html_description;
    $(".name").innerHTML = html_name;
}

window.addEventListener("load",function(){
    //render html
    const {idpd} = getSearchParameters();
    fetch(`${http}products/find/${idpd}`)
    .then((data)=>data.json())
    .then((data)=>{
        renderContent(data.data);
    });
    // + - sl quantity
    const sub = $(".sub");
    const plus = $(".plus");
    const quantityInput = $(".quantity");
    let quantity = 1;
    
    quantityInput.addEventListener("change", function (e) {
      if (+this.value >= 1 && +this.value <= 100) {
        quantity = +this.value;
      } else {
        this.value = quantity;
      }
    });
    
    sub.addEventListener("click", function (e) {
      if (quantity > 1) {
        quantity--;
        quantityInput.value = quantity;
      }
    });
    
    plus.addEventListener("click", function (e) {
      if (quantity < 100) {
        quantity++;
        quantityInput.value = quantity;
      }})

})