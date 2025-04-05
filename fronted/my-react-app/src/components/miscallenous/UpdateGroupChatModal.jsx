import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Box,
    useDisclosure,Button,IconButton,useToast,
    FormControl,Input
  } from '@chakra-ui/react'
  import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
  
  import { ViewIcon } from '@chakra-ui/icons'
  import { ChatState } from '../Context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import UserListItem from '../UserAvatar/UserListItem'
const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,fetchChats}) => {
    const {user,selectedChat,setSelectedChat}=ChatState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName,setGroupChatName]=useState()
    const [search,setSearch]=useState()
    const [searchResult,setSearchResult]=useState()
    const [loading,setLoading]=useState(false)
    const [renameLoading,setRenameLoading]=useState(false)
    const [addUser,setAddUser]=useState()
    const toast=useToast()
    const handleRemove=async(user1)=>{
      
        if(selectedChat.groupAdmin._id!==user._id)
        {
          toast({
            title: 'Admins can remove someone',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position:"bottom-left"
          });
          return ; 
        }
        try {
          setLoading(true)
          const config = {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              chatId: selectedChat._id,
              userId: user1._id
            })
          };
      
          const response = await fetch("http://localhost:5400/api/chat/groupremove", config);
          if(!response.ok) throw new Error("Failed to Fetch")
          const data=await response.json()
           user1._id===user._id ?setSelectedChat(): setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            fetchChats();
            setLoading(false)
          


        } catch (error) {
          toast({
            title: "Failed to Add",
            status: "warning",
            duration: 9000,
            isClosable: true,
          });
        }

    }
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
    const handleRename = async () => {
      if (!groupChatName) return;
    
      try {
        setRenameLoading(true);
    
        const config = {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chatId: selectedChat._id,
            chatName: groupChatName
          })
        };
    
        const response = await fetch("http://localhost:5400/api/chat/rename", config);
    
        if (!response.ok) throw new Error("Error");
    
        const data = await response.json();
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        console.log(data);
      } catch (error) {
        toast({
          title: "Failed to Rename",
          status: "warning",
          duration: 9000,
          isClosable: true,
        });
      } finally {
        setRenameLoading(false);
        setGroupChatName("");
      }
    };
    const handleAddUser=async(user1)=>{
      if(selectedChat.users.find(u => u._id===user1._id))
        {
            toast({
                title: 'User Already Added',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position:"bottom-left"
              });
              return ;
        }
        if(selectedChat.groupAdmin._id!==user._id)
        {
          toast({
            title: 'Admins can add someone',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position:"bottom-left"
          });
          return ; 
        }
        try {
          setLoading(true)
          const config = {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              chatId: selectedChat._id,
              userId: user1._id
            })
          };
      
          const response = await fetch("http://localhost:5400/api/chat/groupadd", config);
          if(!response.ok) throw new Error("Failed to Fetch")
          const data=await response.json()
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
          


        } catch (error) {
          toast({
            title: "Failed to Add",
            status: "warning",
            duration: 9000,
            isClosable: true,
          });
        }
    }
    return (
        <>
          <IconButton  display={{base:"flex"}} onClick={onOpen} icon={<ViewIcon />}/>
    
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
                display={"flex"}
                flexDirection={"row"}
        fontSize={"35px"}
        fontWeight={"normal"}
        justifyContent={"center"}
                fontFamily={"Work Sans"}
              >{selectedChat.chatName}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box display={"flex"}>
                {
                    selectedChat.users.map(u=>
                    (
                        <UserBadgeItem key={u._id} user={u} handleFunction={()=> handleRemove(u)}/>
                    )
                    )
                }
                </Box>
                <FormControl display={"flex"}
                        flexDirection={"row"}
                >
                    <Input 
                        placeholder="Chat Name"
                        mb={3}
                        value={groupChatName}
                        onChange={e=> setGroupChatName(e.target.value)}
                    />
                    <Button
                        variant="solid"
                        colorScheme="teal"
                        ml={1}
                        isLoading={renameLoading}
                        onClick={handleRename}
>
                            Update
                    </Button>
                </FormControl>
                <FormControl display={"flex"}
                        flexDirection={"row"}
                >
                    <Input 
                        placeholder="Add User to Group"
                        mb={3}
                        value={addUser}
                        onChange={e=> handleSearch(e.target.value)}
                    />
                  
                </FormControl>
                {
                    loading?
                    (<div><CircularProgress isIndeterminate color='green.300' /></div>)
                    :
                    (searchResult?.map(user=> <UserListItem key={user._id} user={user} handleFunction={()=> handleAddUser(user)}/>))
                }

              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='red' mr={3} fontWeight={"normal"} width="30%"   onClick={()=> handleRemove(user)}>
                  Leave Group
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
    
    }
export default UpdateGroupChatModal

   
