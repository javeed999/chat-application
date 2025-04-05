import React,{useEffect,useState} from 'react'
import { Box } from "@chakra-ui/react";
import MyChat from "/home/javeed/Documents/MERN STACK/mern-chat-app/fronted/my-react-app/src/components/miscallenous/MyChat"
import ChatBox from "/home/javeed/Documents/MERN STACK/mern-chat-app/fronted/my-react-app/src/components/miscallenous/ChatBox"

import {ChatState} from "/home/javeed/Documents/MERN STACK/mern-chat-app/fronted/my-react-app/src/components/Context/ChatProvider.jsx"
import SideDrawer from "/home/javeed/Documents/MERN STACK/mern-chat-app/fronted/my-react-app/src/components/miscallenous/SideDrawer.jsx"
const ChatPage = () => {
  const {user}=ChatState()
  const [fetchAgain,setFetchAgain]=useState(false)
   

      

  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" w="100%" h="100%" p="10px">
        {user && <MyChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  )
}

export default ChatPage
