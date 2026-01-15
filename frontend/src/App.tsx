import Navbar from './components/navbar'
import FrontPage from './pages/frontpage'
import Signup from './pages/signup'
import Login from './pages/login'
import './css/App.css'
import {HashRouter as Router, Routes, Route} from 'react-router-dom'
import isLoggedIn from './endpoints/apiLoggedin'
import { useState, useEffect } from 'react'

function App() {

  const [loginStatus, setLoginStatus] = useState<boolean>(false);
  const [user, setUser] = useState<string>("")

  //checks if logged in and keeps user logged in
  useEffect( () => {
    async function loggedIn(){
      const result = await isLoggedIn();
      if (result){
        setLoginStatus(result)
        setUser(localStorage.getItem('user') ?? "")
      }
      else{
        setLoginStatus(false)
        setUser("")
      }
    }
    loggedIn()
  }, [])

  return (
    <>
      <Routes>
        <Route element={<Navbar 
          loginStatus={loginStatus}
          setLoginStatus={setLoginStatus}
          user={user}
          setUser={setUser}

        />}>
          <Route path='/' element={<FrontPage />} />
          <Route path='/signup' element={<Signup />}/>
          <Route path='/login' element={<Login setLoginStatus={setLoginStatus} setUser={setUser}/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
