const email=document.getElementById('user-email');
const resetLink=document.getElementById('reset-link');


resetLink.addEventListener('click',(e)=>{
    e.preventDefault();
    axios({
        method:"get",
        url:'http://13.234.127.142/password/forgetpassword',
        headers:{'email': email.value}
    })
    .then((res)=>[
        console.log(res)
    ])
    .catch((err)=>{
        showError(err)
    })
});


function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
};
