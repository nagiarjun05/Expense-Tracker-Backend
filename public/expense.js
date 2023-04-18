// 13.234.127.142


//const rzp1=new Razorpay(options);
// rzp1.open();
// e.preventDefault();

// rzp1.on('payment.failed', function(response){
//     alert(response.error.description);
// })


var addExp=document.getElementById("addExpense");
var amount=document.getElementById("amount");
var description=document.getElementById("description");
var category=document.getElementById("expenseCat");
var expenseList=document.getElementById("exp-list");
const reportbtn=document.getElementById('report');
const downloadBtn=document.getElementById('download');
const pages=document.querySelector('.pagination');
const perpage=document.getElementById('perpage');

const token=localStorage.getItem('token');

addExp.addEventListener('click',addExpense);
expenseList.addEventListener('click', removeExpense);
downloadBtn.addEventListener('click', downloadFile);

let rowperpage;
perpage.addEventListener('input',(e)=>{
    rowperpage=e.target.value;
    let page=1;
    getExpenses(page);
});

const getExpenses=function(page){
    axios({
        method:'get',
        //page sent in query
        // url: `http://localhost:4000/expenses/get-expenses/?page=${page}`,
        //page sent in params
        url: `http://localhost:4000/expenses/get-expenses/${page}`,
        headers:{'Authorization':token, 'rowperpage':rowperpage}
    })
    .then(res=>{
        if (res.data.premiumuser==true){
            document.body.className='dark';
            document.getElementById('purchase').style.display='none';
            const premium=document.createElement('span');
            premium.textContent='You are a Premium User';
            document.getElementById('msg').innerHTML='';
            document.getElementById('msg').appendChild(premium);
            document.getElementById('show-report').style.display='block';
            leaderboard();
            report();
        }
        expenseList.innerHTML='';
        res.data.allExpenses.forEach(element => {
            var li = document.createElement('li');
            const id=element._id.toString();
            li.className='expenseDet';
            li.innerHTML=`${element.amount}-${element.description}-${element.category}-`;
            
            var deleteExpense=document.createElement('button');
            deleteExpense.className='dlt';
            deleteExpense.textContent='Delete Expense';
            deleteExpense.style.border='solid 2px red';

            var expenseId=document.createElement('div');
            expenseId.className='expenseId';
            expenseId.textContent=`${id}`;
            expenseId.style.display='none';

            li.appendChild(deleteExpense);
            li.appendChild(expenseId);
            expenseList.appendChild(li);
        });
        pagination(res.data.currentPage,res.data.hasNextPage,res.data.nextPage,res.data.hasPreviousPage,res.data.previousPage)
    }).catch(err=>showError(err));
};

function pagination(currentPage,hasNextPage,nextPage,hasPreviousPage,previousPage){
    pages.innerHTML='';
    if (hasPreviousPage){
        const prevBtn=document.createElement('button')
        prevBtn.innerHTML=previousPage;
        pages.appendChild(prevBtn);
        prevBtn.addEventListener('click',()=>{
            getExpenses(previousPage)
            });
    };
    
    const curBtn=document.createElement('button')
    curBtn.innerHTML=currentPage;
    pages.appendChild(curBtn);
    curBtn.addEventListener('click',(e)=>{        
        getExpenses(currentPage)
    });

    if (hasNextPage){
        const nexBtn=document.createElement('button')
        nexBtn.innerHTML=nextPage;
        pages.appendChild(nexBtn);
        nexBtn.addEventListener('click',()=>{
            getExpenses(nextPage)
            });
    };
};

window.addEventListener('load', ()=>{
    let page=1;
    getExpenses(page)
});

function addExpense(e){
    e.preventDefault();
    axios({
        method:'post',
        url:`http://localhost:4000/expenses/add-expense`,
        data:{
            amount:`${amount.value} `,
            description:`${description.value} `,
            category:`${category.value} `
        },
        headers:{'Authorization':token}
    }).then(res=>{
        if(res.status==201){
            expenseList.innerHTML='';
            document.getElementById('msg').innerHTML='';
            let page=1;
            getExpenses(page);
            if(document.getElementById('leaderboard').innerHTML){
                document.getElementById('leaderboard').innerHTML='';            
            }
            description.value="";
            amount.value="";
            category.value="";
        }else{
            throw new Error('Failed to create new expense');
        }
    }).catch(err=>showError(err));
        
};

function removeExpense(e){
    e.preventDefault();
    if(e.target.classList.contains('dlt')){
        // console.log(e.target.parentElement.children[1].innerText)
        axios({
            method:'delete',
            url:`http://localhost:4000/expenses/delete-expense/${e.target.parentElement.children[1].innerText}`,
            headers:{'Authorization':token}
        })
        .then((res)=>{
            if(res.status==200){
            }
            expenseList.removeChild(e.target.parentElement)
            let page=1;
            getExpenses(page)
        })
        .catch(err=>{
            showError(err);
        })
        
    }
}


document.getElementById('purchase').onclick= async function (e){
    const response= await axios({
        method:'get',
        url:'http://localhost:4000/purchase/premiummembership',
        headers:{'Authorization':token}
    })

    var options={
        "key":response.data.key_id,
        "name":"Test Company",
        "amount":10000,
        "currency":'INR',
        "order_id":response.data.order.id,
        "prefill":{
            "name":"Test User",
            "email":"test@xyz.com",
            "contact":"9875641234"
        },
        "theme":{
            "color":"#3399cc"
        },

        //Handler for payment succession
        "handler":function(response){
            axios({
                method:'post',
                url:'http://localhost:4000/purchase/updatetransaction',
                data:{
                    order_id:options.order_id,
                    payment_id:response.razorpay_payment_id
                },
                headers:{'Authorization':token}
            })
            .then((res)=>{
                localStorage.setItem('token',res.data.token)
                let page=1;
                getExpenses(page);
                alert("You are a Premimum User now!")
            })
            .catch((err)=>{
                console.log(err)
                alert("Something went wrong!")
            })
        }
    }
    const rzp1=new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function(response){
        alert(response.error.description);
    })
};


const getReport=function(){
    document.getElementById('report-h2').style.display='block';
    console.log("clicked")
}

const report=function(){
    if(document.getElementById('report').style.display='none'){
        document.getElementById('report').style.display='block';
    }
    const reportdetails=document.getElementById('show-report')
    document.getElementById('show-report').style.display='block';
    
    reportdetails.addEventListener('click',getReport)
}

const getLeaderboard=function(){
    document.getElementById('leaderboard-h2').style.display='block';
    axios({
        method:'get',
        url:'http://localhost:4000/premium/get-leaderboard',
        headers:{'Authorization':token}    
    })
    .then((res)=>{
        document.getElementById('leaderboard').innerHTML='';
        res.data.forEach((element)=>{
            var li = document.createElement('li');
            li.className='leaderboard-item';
            li.innerHTML=`Name - ${element.name},   Total Expense Amount - ${element.total}`;
            document.getElementById('leaderboard').appendChild(li);
        })
    })
    .catch((err)=>{
        showError(err)
    })
}

const leaderboard=function(){
    if(document.getElementById('leaderboard').style.display='none'){
        document.getElementById('leaderboard').style.display='block';
    }
    const leaderboardList=document.getElementById('show-leaderboard')
    document.getElementById('show-leaderboard').style.display='block';
    
    leaderboardList.addEventListener('click',getLeaderboard)
}

function downloadFile(e){
    e.preventDefault();
    axios({
        method:'get',
        url:'http://localhost:4000/users/download',
        headers:{'Authorization':token}
    })
    .then((res)=>{
        if(res.status==201){
            var a=document.createElement('a');
            a.href=res.data.fileURL;
            a.download='myexpense.cv'
            a.click()
        }else{
            throw new Error(res.data.message);
        }
    })
    .catch((err)=>{
        showError(err);
    })
};

function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
};