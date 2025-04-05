import React,{useState,useEffect} from 'react'
import {ChatState} from "../Context/ChatProvider"
import { useToast,Box,Button ,Stack,Text} from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon ,AddIcon} from '@chakra-ui/icons'
import ChatLoading from '../ChatLoading'
import { getSender } from '../config/ChatLogics'
import GroupChatModel from './GroupChatModel'
const MyChat = ({fetchAgain}) => {
  const toast=useToast();
  const[loggedUser,setLoggedUser]=useState() 
   const {chats,setChats,user,selectedChat,setSelectedChat}=ChatState();
  const fetchChats=async()=>{
    try{
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }
      const response=await fetch("http://localhost:5400/api/chat/",config);
      if(!response.ok)
        throw new Error("Failed To Fetch")
      const data=await response.json();
      setChats(data);

    }
    catch(err)
    {
      toast({
        title: 'Something Went Wrong',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position:"top-left"
      });
    }
  }
  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChats();
  },[fetchAgain])

  return (
    <Box display={{base:selectedChat ?"none":"flex" ,md:"flex"}} flexDirection={"column"} alignItems={"center"} p="3" bg="white" w={{base:"100%",md:"31%"}} borderRadius={"lg"} borderWidth={"1px"} >
    <Box pb="3" px="3"  fontSize={{base:"28px",md:"30px"}} fontFamily={"Work Sans"}  display="flex" w="100%" flexDirection={"row"}  justifyContent={"space-between"} alignItems="center">
            My Chats
      <GroupChatModel>
      <Button d="flex"   fontSize={{base:"17px",md:"10px",lg:"17px"}} rightIcon={<AddIcon />}>
        New Group chat
      </Button>
      </GroupChatModel>
      
    </Box>
      <Box 
        display={"flex"}
        flexDirection={"column"}
        p="3"
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {chats ?(<Stack overflowY="hidden">
          {chats.map((chat)=> (
            <Box
              onClick={()=> setSelectedChat(chat)}
              cursor="pointer"
              bg={selectedChat ===chat ? "#38B2AC" :"#E8E8E8"}
              color={selectedChat===chat ?"white":"black"}
              px="3"
              py="2"
              borderRadius={"lg"}
              key={chat._id}
            >
              <Text>
                {!chat.isGroupChat ? (getSender(loggedUser,chat.users)) :chat.chatName }
                
              </Text>

            </Box>
          ))}
        </Stack>) 
         :(<ChatLoading />)  
         }
      </Box>
    </Box>
  )
}

export default MyChat 