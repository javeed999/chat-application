import {createContext,useState,useEffect,useContext} from "react"
import {useHistory} from "react-router-dom"
const ChatContext=createContext()

const ChatProvider=({children})=>{
    const [user,setUser]=useState();
    const[selectedChat,setSelectedChat]=useState();
    const[chats,setChats]=useState([])
    const history=useHistory()
    useEffect(()=>{
        const userInfo=JSON.parse(localStorage.getItem("userInfo"))
        if(!userInfo)
            history.push("/")
        setUser(userInfo)
    },[history.pathname])
    return <ChatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,chats,setChats}}>
        {children}
    </ChatContext.Provider>
    

}

export const ChatState=()=>{
    return useContext(ChatContext)
}
export default ChatProvider