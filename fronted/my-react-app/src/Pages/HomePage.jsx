import React,{useEffect} from "react";
import { Container, Box, Text,Tabs, TabList, TabPanels, Tab, TabPanel  } from "@chakra-ui/react";
import Login from "../components/Authentication/Login"
import SignUp from "../components/Authentication/SignUp"
import {useHistory} from "react-router-dom"
const HomePage = () => {

  const history=useHistory()
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("userInfo"))
    if(user) history.push("/chats")
  },[history])

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"  // ✅ Added flex display
        justifyContent="center" // ✅ Centers horizontally
        p={3}
        bg={""}
        w="100%"
        m="40px 0px 15px 0px"
        borderRadius="lg"
        borderWidth="1px"
        borderColor={"red"}
      >
        <Text 
          fontSize={"4xl"}  
          fontFamily={"Work Sans"} 
          color="black"
        >
          Talk-A-Tive
        </Text>
      </Box>
      <Box  w="100%" p={4} borderRadius={"lg"} borderWidth="1px" color="black">
            <Tabs variant='soft-rounded' >
        <TabList mb="1em">
            <Tab width={"50%"}>Login</Tab>
            <Tab width="50%">SignUp</Tab>
        </TabList>
        <TabPanels>
            <TabPanel>
            {/* Login */}
            <Login />
            </TabPanel>
            <TabPanel>
            {/* SignUp */}
            <SignUp />
            </TabPanel>
        </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
