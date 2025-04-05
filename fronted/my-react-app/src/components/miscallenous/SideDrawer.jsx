import React, { useState } from "react"
import { Box, Tooltip, Button, Text,Spinner } from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from "../Context/ChatProvider"
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import ProfileModel from "./ProfileModel";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Input
} from '@chakra-ui/react'
import UserListItem from "../UserAvatar/UserListItem";
import ChatLoading from "../ChatLoading"
import { useHistory } from "react-router-dom"
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { useDisclosure } from "@chakra-ui/react";
const SideDrawer = () => {
        const toast = useToast()
  const { user,chats,setChats,selectedChat,setSelectedChat } = ChatState()
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState()
  const history = useHistory();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/")
  }
  const accessChat=async(userId)=>{
    try {
      
        setLoadingChat(true)
        const config={
          headers:{
            "Content-type":"application/json",
            Authorization:`Bearer ${user.token}`,
          },
          method:"POST",
          body:JSON.stringify({userId:userId})
        }
        const response=await fetch(`http://localhost:5400/api/chat`,config)
        const data=await response.json();

        setLoadingChat(false)
        setSelectedChat(data)
        onClose();
      
    } catch (error) {
      toast({
        title: 'Something Went Wrong',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position:"top-left"
      });
    }

  }
  // 
  const { isOpen, onOpen, onClose } = useDisclosure()
  const handleSearch=async()=>{
    if(!search)
    {

      toast({
        title: 'Please Enter something in search.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position:"top-left"
      });
    }
    try{
      setLoading(true)
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`,
        },
      }
      const response=await fetch(`http://localhost:5400/api/user?search=${search}`,config)
      const data=await response.json();
      setLoading(false)
      setSearchResult(data)
    }
    catch(err)
    {
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

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth={"5px"}
      >
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i class="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4px">Search User</Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"Work Sans"}>
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}  >
              <BellIcon fontSize={"2xl"} m={1}></BellIcon>
            </MenuButton>
            <MenuList>
              <MenuItem>Download</MenuItem>
              <MenuItem>Create a Copy</MenuItem>
              <MenuItem>Mark as Draft</MenuItem>
              <MenuItem>Delete</MenuItem>
              <MenuItem>Attend a Workshop</MenuItem>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />

            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>Profile</MenuItem>

              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>LogOut</MenuItem>
            </MenuList>
          </Menu>

        </div>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" flexDirection={"row"} justifyContent={"space-around"} pb="2">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search by name or email'
                mr={2}

              />
              <Button onClick={handleSearch}>
                Go
              </Button>
            </Box>
            {loading ?
            (<ChatLoading />):
            (
              
              searchResult.map(eachItem=> (<UserListItem key={eachItem._id} user={eachItem} handleFunction={()=>accessChat(eachItem._id)}/>))
            )}
            {loadingChat  && <Spinner ml="auto" d="flex"/>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer
