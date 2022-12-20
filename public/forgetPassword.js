const email=document.getElementById('user-email');
const resetLink=document.getElementById('reset-link');


resetLink.addEventListener('click',(e)=>{
    e.preventDefault();
    axios({
        method:"get",
        url:'http://3.109.48.0/password/forgetpassword',
        headers:{'email': email.value}
    })
    .then((res)=>[
        console.log(res)
    ])
    .catch((err)=>{
        console.log(err)
    })
});