import React,{useState} from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    useToast,
    FormControl,
    Box
  } from '@chakra-ui/react'
  import axios from "axios"
  import {
    Input,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
  } from '@chakra-ui/react'
import { ChatState } from '../Context/ChatProvider'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
  const GroupChatModel = ({children}) => {
    const {user,setChats,chats}=ChatState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName,setGroupChatName]=useState()
    const [selectedUsers,setSelectedUsers]=useState([])
    const [search,setSearch]=useState("")
    const [searchResult,setSearchResult]=useState()
    const [loading,setLoading]=useState(false)
    const toast=useToast()
    const handleSubmit = async () => {
      if (!groupChatName || !selectedUsers) {
        toast({
          title: 'Please Fill All Fields',
          status: 'warning',
          duration: 3000,
          isClosable: true,
          position: "top-left"
        });
        return;
      }
    
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json"
          },
        };
    
        const {data} = await axios.post("http://localhost:5400/api/chat/group", {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map(u => u._id)) // No need to stringify again
        }, config);
            
        console.log(data);
        if(!chats.includes(data))
          setChats([data, ...chats]);
        setSelectedUsers([])
        setSearchResult()
        onClose();
    
        toast({
          title: 'New Group Chat Created',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: "top-left"
        });
    
      } catch (error) {
        toast({
          title: error.message || 'Failed to Create Group Chat',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: "top-left"
        });
      }
    };
    
    
    const handleSearch=async(query)=>{
        setSearch(query)
        if(!query)
                return ;
       try {
            setLoading(true)
            const config={
                "headers":{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const response=await fetch(`http://localhost:5400/api/user?search=${search}`,config)
            const data=await response.json()
            setLoading(false)
            setSearchResult(data)
       } catch (error) {
        toast({
            title: 'Error Occured',
            description:"Failed to Load the Search Results",
            status: 'warning',
            duration: 3000,
            isClosable: true,
            position:"bottom-left"
          });
       }
    }
    const handleGroup=(user)=>{
        if(selectedUsers?.includes(user))
        {
            toast({
                title: 'User Alreadt Added',
                description:"Failed to Load the Search Results",
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position:"bottom-left"
              });
              return ;
        }
        setSelectedUsers([...selectedUsers,user])
    }
    const handleDelete=(deleteUser)=>{
        setSelectedUsers(
            selectedUsers.filter(sel=> sel._id !== deleteUser._id)
        )
    }
    return (
        <>
          <span onClick={onOpen}>{children}</span>
    
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader fontSize={"30px"} fontWeight={"normal"} fontFamily={"Work Sans"} display="flex" justifyContent={"center"}>Create Group Chat</ModalHeader>
              <ModalCloseButton />
              <ModalBody display={"flex"} flexDirection={"column" } alignItems="center">
                <FormControl>
                    <Input placeholder='Chat Name' mb="3" outline={"none"} onChange={(e)=> setGroupChatName(e.target.value)}/>
                    <Input placeholder='Add Users eg: John,Piyush,Jane' mb={3} onChange={e=> handleSearch(e.target.value)}/>
                </FormControl>
                {/* selected users */}
                <Box display="flex" flexDirection="row">
                {
                    selectedUsers?.map((u)=>(
                        <UserBadgeItem 
                            key={u._id}
                            user={u}
                            handleFunction={()=> handleDelete(u)}
                        />

                    ))
                }
                </Box>
                {/* render searched results */}
                {
                    loading?
                    (<div><CircularProgress isIndeterminate color='green.300' /></div>)
                    :
                    (searchResult?.slice(0,4).map(user=> <UserListItem key={user._id} user={user} handleFunction={()=> handleGroup(user)}/>))
                }
              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='blue'  onClick={handleSubmit}>
                  Create Chat
                </Button>

              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
    )
}

export default GroupChatModel
