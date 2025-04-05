import React,{useState} from "react"
import {  VStack ,InputRightElement,InputGroup,Button} from '@chakra-ui/react'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import {useHistory} from "react-router-dom"

const Login=()=>{
      const toast = useToast()
    const history=useHistory()

    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [show,setShow]=useState(false)
    const [loading,setLoading]=useState(false)
     const handleClick=()=>{
        setShow(!show)
    }
     const submitHandler=async()=>{
        setLoading(true)
        if(!email || !password)
        {
            toast({
                title: 'Please Fill All Fields.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
              });
              setLoading(false)
              return ;
        }
        try{
            const options={
                "method":"POST",
                headers:{
                    "Content-type":"application/json",
                },
                body:JSON.stringify({email,password})
                
            }
            const response=await fetch("http://localhost:5400/api/user/login",options)
            const data=await response.json();
            if(response.ok)
            {
                toast({
                    title: 'Login Successful.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  });
                  localStorage.setItem("userInfo",JSON.stringify(data))
                  history.push("/chats")
            }
            else{
                setLoading(false)
            toast({
                title: 'Invaild Email Or Password.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
              });
            }
            setLoading(false)
        }
        catch (err) {
            console.log(err);
            toast({
                title: "Something went wrong!",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            setLoading(false); // Make sure loading is reset
        }
        

    }
    return (
        <VStack spacing={"5px"} color="black">
              <FormControl id="email" isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input placeholder="Enter Your Email"  value={email} onChange={(event)=>setEmail(event.target.value)}/>
              </FormControl>
               <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                      <Input type={show? "text":"password"} value={password}  placeholder="Enter Your Password" onChange={(event)=>setPassword(event.target.value)}/>
                      <InputRightElement width="4.5rem">
                          <Button h="1.75rem" size="sm" onClick={handleClick}>
                              {show ?"Hide":"Show"}
                          </Button>
                      </InputRightElement>
                  </InputGroup>
              </FormControl>
              
              
              <Button colorScheme="blue" width="100%" style={{marginTop:15}} onClick={submitHandler} isLoading={loading}>
              Login
              </Button>
              <Button width="100%" colorScheme="red" variant="solid" onClick={()=> {
                setEmail("guest@example.com");
                setPassword("123456")
              }}>
                Get User Credentials
              </Button>
              </VStack>
    )

}

export default Login