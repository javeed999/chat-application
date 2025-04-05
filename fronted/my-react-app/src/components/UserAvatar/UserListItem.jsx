import React from 'react'
import { Box ,Text,Avatar} from '@chakra-ui/react'
const UserListItem = ({user,handleFunction}) => {
  return (
    <Box onClick={handleFunction} cursor="pointer" bg="#E8E8E8" _hover={{background:"pink",color:"white"}} w="100%" display={"flex"}
    alignItems={"center"}
    color="black"
    p="10px 13px 10px 3px"
    mb="2"
    borderRadius={"lg"}
    >
    <Avatar
    size="sm"
    cursor="pointer"
    name={user.name}
    src={user.pic}
    />
    <Box>
        <Text>{user.name}</Text>
        <Text fontSize={"14px"}>
        <b>Email:</b>
        {user.email}
        </Text>
    </Box>

    </Box>
)
}

export default UserListItem