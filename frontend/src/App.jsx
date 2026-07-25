import React, { useEffect } from 'react'
import Home from './pages/Home';
import getCurrentUser from './features/getCurrentUser.js';
import { useDispatch } from "react-redux";
import {setUserData} from "./redux/userSlice.js"
function App() {

  const dispatch = useDispatch()

  useEffect(()=>{
    const getUser=async ()=>{
      const userData = await getCurrentUser()
      dispatch(setUserData(userData))
    }
    getUser()
  },[])
  return (
    <>
      <Home />
    </>
  )
}

export default App