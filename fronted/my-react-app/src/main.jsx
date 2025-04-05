import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import {BrowserRouter} from "react-router-dom"
import './index.css'
import App from './App.jsx'
import ChatProvider from "/home/javeed/Documents/MERN STACK/mern-chat-app/fronted/my-react-app/src/components/Context/ChatProvider.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <ChakraProvider>
    <ChatProvider>

      <App />
      </ChatProvider>

    </ChakraProvider>
    </BrowserRouter>
  </StrictMode>,
)
