import React from 'react'
import { auth, googleProvider } from './../utils/firebase';
import { signInWithPopup } from 'firebase/auth';
import api from '../utils/axios';

function App() {
  const handleLogin= async (token) => {
    try {
      const {data} = await api.post("/auth/login",{token})
    console.log(data)
    
    } catch (error) {
      console.log(error)
    }
    
  }
  const googleLogin = async () => {
    try {
      const data = await signInWithPopup(auth,googleProvider)
    const token = await data.user.getIdToken()
    console.log(token)
    await handleLogin(token)
    console.log(data)

    } catch (error) {
      console.log(error)
    }
    
  }
  return (
    <div>
    <button onClick={googleLogin}
  className="w-full flex items-center justify-center gap-3 py-[11px] rounded-xl text-sm font-medium text-white bg-gradient-to-br from-indigo-500 to-violet-700 hover:from-indigo-400 hover:to-violet-600 active:from-indigo-600 active:to-violet-800 border border-indigo-500/30 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-150 cursor-pointer">
  Continue with Google
</button>
    </div>
  )
}

export default App