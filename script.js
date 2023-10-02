const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin');
const iconClose = document.querySelector('.icon-close');


registerLink.addEventListener('click',()=> {
    wrapper.classList.add('active');
});
loginLink.addEventListener('click',()=> {
    wrapper.classList.remove('active');
});
btnPopup.addEventListener('click',()=> {
    wrapper.classList.add('active-popup');
});
iconClose.addEventListener('click',()=> {
    wrapper.classList.remove('active-popup');
});

function auth(){
    var email = document.getElementById("email-id").value;
    var password = document.getElementById("password").value;
   if(email == "admin@gmail.com" && password == "admin123"){
        window.location.href = "index1.html";
      alert("Login success");
    }
    
}