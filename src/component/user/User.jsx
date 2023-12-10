import React from 'react'
import { useNavigate } from 'react-router-dom'

const User = () => {
  const navigate = useNavigate('')
  const newUser = () => {
    navigate('/newUser')
  }

  return (
    <div>
        <div><h1>user list</h1></div> 
        <button onClick={newUser}>add User</button>
    </div>
  )
}

export default User
