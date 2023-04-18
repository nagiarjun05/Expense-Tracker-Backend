// const http=require('node:http');
// const os=require('os');
// const cluster=require('cluster');
// console.log(os.cpus().length);
// if(cluster.isMaster){
//     console.log(`Master process ${process.pid} is running`)
//     cluster.fork()
//     cluster.fork()
// }
// else{
//     console.log(`Worker process ${process.pid} is running`)
//     const server=http.createServer((req, res)=>{
//         if(req.url==='/normal'){
//             console.log(req.url)
//             res.writeHead(200,{"Content-Tupe":"text/plain"});
//             res.end("Home Page")
//         }else if(req.url==='/slow'){
//             for(let i=0;i<6000000000;i++){}
//             res.writeHead(200,{"Content-Tupe":"text/plain"});
//             res.end("Slow Page")
//         }
//     });   
// server.listen(8000,()=>{ console.log("Server is running on the port 8000")})    
// }