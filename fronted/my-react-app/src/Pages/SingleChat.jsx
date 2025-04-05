import React,{useState,useEffect} from 'react'
import {Box,FormControl,IconButton,Text,Input,useToast} from "@chakra-ui/react"
import { ChatState } from '../components/Context/ChatProvider'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender,getSenderFull } from '../components/config/ChatLogics'
import { Spinner } from '@chakra-ui/react'
import ProfileModel from '../components/miscallenous/ProfileModel'
import UpdateGroupChatModal from '../components/miscallenous/UpdateGroupChatModal'
import ScrollableChat from './ScrollableChat'
import axios from 'axios'
import "./index.css"
import io from "socket.io-client"
const ENDPOINT="http://localhost:5400"
var socket,selectedChatCompare;

const SingleChat = ({fetchAgain,setFetchAgain}) => {
   
  const {user,selectedChat,setSelectedChat}=ChatState()
  const [newMessage,setNewMessage]=useState("")
  const[loading,setLoading]=useState(false)
  const[socketConnection,setSocketConnection]=useState(false)
  const [typing,setTyping]=useState(false)
  const [isTyping,setIsTyping]=useState(false)
  const toast=useToast()
    const[messages,setMessages]=useState([])

    useEffect(()=>{
        socket=io(ENDPOINT)
        socket.emit("setup",user)
        socket.on("connected",()=>{
            setSocketConnection(true)
        })
        socket.on("typing",()=>{
            setIsTyping(true)
        })
        socket.on("stop typing",()=> setIsTyping(false))
    })

    useEffect(()=>{
        fetchChats();
        selectedChatCompare=selectedChat
    },[selectedChat])

        useEffect(()=>{
            socket.on("message Received",(newMessageReceived)=>{
                if(!selectedChatCompare || selectedChatCompare._id!==newMessageReceived.chat._id)
                {
                                        //give notification
                }

                else 
                {
                    setMessages([...messages,newMessageReceived])
                }
            })
        })

    const fetchChats=async()=>{
        if(!selectedChat)
                return 
        try {
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
                setLoading(true)
            const {data}=await axios.get(`http://localhost:5400/api/message/${selectedChat._id}`,config)
            setMessages(data)
            // console.log(data)
            setLoading(false)
            socket.emit("join chat",selectedChat._id)
        } catch (error) {
            toast({
                title: 'Something Went Wrong',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position:"bottom"
              });
        }
    }
const sendMessage=async(e)=>{
    if(e.key==="Enter" && newMessage)
    {
        socket.emit("stop typing",selectedChat._id)
        try {
            const config={
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${user.token}`
                }
            }
            setNewMessage("")
            const {data}=await axios.post("http://localhost:5400/api/message/",{
                chatId:selectedChat._id,
                content:newMessage
            },config)

            socket.emit("new message",data)
            setMessages([...messages,data])
            // console.log(data)
        } catch (error) {
            toast({
                title: 'Something Went Wrong',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position:"bottom"
              });
        }

    }

}
const typingHandler=(e)=>{
    setNewMessage(e.target.value)
    // Typing Indicator Logic
    if(!socketConnection)    return ;
    if(!typing)
    {
        socket.emit("typing",selectedChat._id)
        setTyping(true)
    }
    let lastTypingTime=new Date().getTime()
    var timerLength=1000;
    setTimeout(()=>{
        var timeNow=newDate().getTime();
        var timeDifference=timeNow - lastTypingTime;
        if(timeDifference >= timerLength && typing)
        {
            socket.emit("stop typing",selectedChat._id)
            setTyping(false)
        }
        },timerLength)

}
    return <>
        {
            selectedChat ? (<> 
            <Text
                fontSize={{base:"28px",md:"30px"}}
                pb={3}
                px={2}
                w="100%"
                fontFamily={"Work Sans"}
                display={"flex"}
                justifyContent={{base:"space-between"}}
                alignItems={"center"}
            >
                <IconButton 
                    display={{base:"flex",md:"none"}}
                    icon={<ArrowBackIcon />}
                    onClick={()=> setSelectedChat("")}
                />
                {!selectedChat.isGroupChat ?
                (
                    <>
                    {getSender(user,selectedChat.users)}
                    <ProfileModel user={getSenderFull(user,selectedChat.users)}/>
                    </>
                )
                    :
                (
                    <>
                    {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchChats={fetchChats}/>
                    </>
                )
            }
            </Text>
            <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"flex-end"}
                p={3}
                bg="#E8E8E8"
                w="100%"
                h="80%"
                borderRadius={"lg"}
                overflowy="hidden"
            >
                {/* Messages Here */}
                {
                    loading ?
                    (  <Spinner size='xl' w={20} h={20} alignSelf={"center"} margin="auto"/>
                    )
                    :
                    (
                        <div className="messages">
                        <ScrollableChat messages={messages}/>    
                        </div>
                    )
                }
                <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                 {
                    isTyping ?
                    (<div>loading...</div>)
                    :
                    (<div></div>)
                 }
                    <Input variant="filled" bg="#E0E0E0" placeholder="Enter a message..." onChange={typingHandler}  value={newMessage}/>
                </FormControl>
            </Box>
            </>)
            :
            (
                <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    h="100%"
                >
                    <Text fontSize="2xl" pb="3" fontFamily={"Work Sans"}>
                    Click on a user to start chatting
                    </Text>

                </Box>
            )
        }
    </>
}

export default SingleChat