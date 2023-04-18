const email=document.getElementById('user-email');
const resetLink=document.getElementById('reset-link');


resetLink.addEventListener('click',(e)=>{
    e.preventDefault();
    axios({
        method:"get",
        url:'http://localhost:4000/password/forgetpassword',
        headers:{'email': email.value}
    })
    .then((res)=>{
        if(res.status==202){
            document.getElementById("main-container").innerHTML=`<div>
                                                                    <h1>Link to reset password sent to your mail. Now, redirecting you to the login page in 5 Seconds</h1>
                                                                 <div>`
            setTimeout(()=>{
                window.location.href="./login.html"
            },5000);
        }
    })
    .catch((err)=>{
        if (err.response.status === 400) {
            alert(err.response.data.message);
        } else if (err.response.status === 404) {
            alert(err.response.data.message);
        } else if (err.response.status === 500) {
            alert(err.response.data.message);
        } else {
            showError(err)
        }
    })
});


function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
};
