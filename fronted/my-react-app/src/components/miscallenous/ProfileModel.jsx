import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton,
    Button,
    Image,
    Text
  } from '@chakra-ui/react'
  import { useDisclosure } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
const ProfileModel = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

  return (
        <>
                <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
            <ModalOverlay />
            <ModalContent p="20px">
            <ModalHeader
                fontSize={"23px"}
                fontFamily={"Work Sans"}
                display="flex"
                justifyContent={"center"}
            >{user.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody display="flex"  flexDirection="column" alignItems={"center"} justifyContent="space-between">
            <Image borderRadius={"full"}   boxSize="160px" src={user.pic} alt={user.name} />
            <Text fontSize={{base:"28px",md:"25px"}} fontFamily={"Work Sans"}>Email:{user.email}</Text>
               
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
                </Button>
            </ModalFooter>
            </ModalContent> 
        </Modal> 
        {children ? (<span onClick={onOpen}>{children}</span> ) :
        (<IconButton  display={{base:"flex"}} icon={<ViewIcon />} onClick={onOpen} />)}
        </>
  )
}

export default ProfileModel

