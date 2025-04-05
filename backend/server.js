const express=require("express")
const app=express()
const cors=require("cors")
const dotEnv=require("dotenv")
const {chats}=require("./data/data")
dotEnv.config()

const connectDB=require("./config/db")
connectDB();
const userRoutes=require("./routes/userRoutes")
const chatRoutes=require("./routes/chatRoutes")
const messageRoutes=require("./routes/messageRoutes")

const {notFound,errorHandler}=require("./middleware/errorMiddleware")

 
app.use(express.json())
app.use(cors())
app.get("/",(req,res)=>{
    res.send("Api is Running")
})

app.get("/data",(req,res)=>{
    res.send(chats)
})
app.get("/data/:id",(req,res)=>{
    console.log(req.params.id)
    const data=chats.find(chat=>chat._id===req.params.id)
    res.send(data)
})

const PORT=process.env.PORT || 5400


app.use("/api/user",userRoutes)
app.use("/api/chat",chatRoutes)
app.use("/api/message",messageRoutes)
app.use(notFound)
app.use(errorHandler)

const server=app.listen(PORT,()=>{
    console.log("Server Started")
})

const io=require("socket.io")(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:5173"
    }
})


io.on("connection",(socket)=>{
    console.log("connected to socket.io")
    socket.on("setup",(userData)=>{
        socket.join(userData._id)
        console.log("User Joined room "+userData._id)
        socket.emit("connected")
    })
    socket.on("join chat",(room)=>{
        socket.join(room);
        console.log("user Joined room "+room)
    })

    socket.on("new message",(newMessageReceived)=>{
        var chat=newMessageReceived.chat
        if(!chat.users) return console.log("chat.users not defined")
        chat.users.forEach(user=>{
        if(user._id===newMessageReceived.sender._id) return ;
        socket.in(user._id).emit("message Received",newMessageReceived)
            
        })
    })

    socket.on("typing",(room)=>{
        socket.in(room).emit("typing")
    })
    socket.on("stop typing",(room)=>{
        socket.in(room).emit("stop typing")
    })
})