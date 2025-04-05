import { useState } from 'react'
import { Button, ButtonGroup } from '@chakra-ui/react'
import './App.css'
import HomePage from './Pages/HomePage'
import {Route,Switch  } from "react-router-dom"
import ChatPage from './Pages/ChatPage'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
        <Route exact path="/" component={HomePage}/>
        <Route exact path="/chats" component={ChatPage}/> 
    </div>
  )
}

export default App
