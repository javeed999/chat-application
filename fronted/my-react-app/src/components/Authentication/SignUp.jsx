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
// import axios from "axios"
import {useHistory} from "react-router-dom"
const SignUp=()=>{
    const history=useHistory()
    const[name,setName]=useState("")
    const[email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const[confirmPassword,setConfirmPassword]=useState("")
    const [show,setShow]=useState(false)
    const[pic,setPic]=useState()
    const [loading,setLoading]=useState(false)
    const handleClick=()=>{
        setShow(!show)
    }
      const toast = useToast()

    const postDetails=(pics)=>{
        setLoading(true)
        if(pics===undefined)
        {
             toast({
          title: 'Select Image.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return 
        }
        if(pics.type==="image/jpeg" || pics.type==="image/png")
        {
            const data=new FormData();
            data.append("file",pics);
            data.append("upload_preset","chat-app");
            data.append("cloud_name","dnwlogp88")
            fetch("https://api.cloudinary.com/v1_1/dnwlogp88/image/upload",{
                "method":"POST",
                "body":data
            })
            .then((res)=>res.json())
            .then(data=> {
                setPic(data.url.toString())
                console.log(data)
                setLoading(false)
            })
            .catch(err=>{
                console.log(err);
                setLoading(false);
            })    
        }
            
            else 
            {
                 toast({
                title: 'Select Image.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
        });
            }
    }
    const submitHandler=async()=>{
        setLoading(true)
        if(!name || !email || !password || !confirmPassword)
        {
            toast({
                title: 'Please Fill All The Fields',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            setLoading(false);
            return ;
        }
        if(password!==confirmPassword)
        {
            toast({
                title: 'Password Do Not Match',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
                setLoading(false);

            return 
        }
        try{
            const response = await fetch("http://localhost:5400/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password, pic })
        });

        const data = await response.json(); // Parse the JSON response
        console.log(data)
        if (!response.ok) {
            throw new Error(data.message || "Registration failed");
        }

            toast({
                title: 'Registration Successful',
                status: 'success',
                duration: 9000,
                isClosable: true,
                });
        localStorage.setItem("userInfo",JSON.stringify(data))
        setLoading(false)
        history.push("/chats")
        }
        catch(err)
        {
            console.log(err)
        }

    }
    return (
        <VStack spacing={"5px"} color="black">
        <FormControl id="first-name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder="Enter Your Name"  value={name}  onChange={(event)=>setName(event.target.value)}/>
        </FormControl>
        <FormControl id="email-signup" isRequired>
            <FormLabel>Email</FormLabel>
            <Input placeholder="Enter Your Email"  value={email} onChange={(event)=>setEmail(event.target.value)}/>
        </FormControl>
         <FormControl id="password-signup" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input type={show? "text":"password"}   placeholder="Enter Your Password" onChange={(event)=>setPassword(event.target.value)}/>
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ?"Hide":"Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id="confirm-password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
                <Input type={show? "text":"password"}   placeholder="Enter Your Password" onChange={(event)=>setConfirmPassword(event.target.value)}/>
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ?"Hide":"Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id="pic">
            <FormLabel>Upload Your Picture</FormLabel>
                <Input type="file" accept="image/" p="1.5" onChange={(event)=>postDetails(event.target.files[0])}/>

        </FormControl>
        <Button colorScheme="blue" width="100%" style={{marginTop:15}} onClick={submitHandler}
        isLoading={loading}
        >
        Sign Up
        </Button>
        </VStack>
    )

}

export default SignUp
