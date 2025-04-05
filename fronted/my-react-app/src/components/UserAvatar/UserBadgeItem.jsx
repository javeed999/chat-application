// import React from 'react'
// import {
//     Box
//   } from '@chakra-ui/react'
// import { CloseIcon } from '@chakra-ui/icons'
// //   import { IoMdClose } from "react-icons/io";


// const UserBadgeItem = ({user,handleFunction}) => {
//   return (
//     <Box
//     p={3}
//      px={2}
//      py={1}
//      borderRadius={"lg"}
//      m={3}
//      mb={2}
//      variant="solid"
//      fontSize={12}
//      backgroundColor="purple"
//      cursor="pointer"
//      color="white"
//     >
//         {user.name}
//         {/* <IoMdClose /> */}
//         <span onClick={handleFunction}>        <CloseIcon pl="1"/>
//         </span>

//     </Box>
//   )
// }

// export default UserBadgeItem
// UserBadgeItem Component
import React from 'react'
import { Box } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      p={2}
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      backgroundColor="purple"
      cursor="pointer"
      color="white"
      display="flex"
      alignItems="center"
    >
      {user.name}
      <CloseIcon ml={2} onClick={handleFunction} cursor="pointer" />
    </Box>
  );
};

export default UserBadgeItem;