const userName=document.getElementById("user-name");
const userEmail=document.getElementById("user-email");
const passWord=document.getElementById("password");
const signup=document.getElementById("signup");

signup.addEventListener('click',async (e)=>{
    try{
        e.preventDefault();
        if (!userName.value||!userEmail.value||!passWord.value){
            return alert("All fields are mandatory!")
        }
        const  name=userName.value;
        const  email=userEmail.value;
        const  password=passWord.value;
        
        const res=await axios({
            method:'post',
            url:`http://localhost:4000/users/signup`,
            data:{
                name: name,
                email: email,
                password: password
                }
            }
        )
        alert(res.data.message);
        window.location.href="./login.html"
    }
    catch(err){
        if (err.response.status === 400) {
            alert(err.response.data.message);
        } else if (err.response.status === 403) {
            alert(err.response.data.message);
        } else if (err.response.status === 500) {
            alert(err.response.data.message);
        } else {
            showError(err)
        }};
});

function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
};
