import Navbar from './components/navbar'
import FrontPage from './pages/frontpage'
import Signup from './pages/signup'
import Login from './pages/login'
import Repos from './pages/repos'
import './css/App.css'
import {Routes, Route} from 'react-router-dom'
import isLoggedIn from './endpoints/apiLoggedin'
import ApiGetRepos from './endpoints/apiGetRepos'
import ApiViewRepo from './endpoints/apiViewRepo'
import { useState, useEffect } from 'react'

function App() {

  const [loginStatus, setLoginStatus] = useState<boolean>(false);
  const [user, setUser] = useState<string>("")
  const [repos, setRepos] = useState<string[]>([]);
  const [data, setData] = useState<string>("");
  const [imageData, setImageData] = useState<string>("")

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

  async function handleGetRepos(){
    const res = await ApiGetRepos();
    setRepos(res.names);
  }

  async function handleViewRepo(name: string){
    const res = await ApiViewRepo(name);
    setData(res.data);
    setImageData(res.image)
  }

  return (
    <>
      <Routes>
        <Route element={<Navbar 
          loginStatus={loginStatus}
          setLoginStatus={setLoginStatus}
          user={user}
          setUser={setUser}
          getRepos={handleGetRepos}
        />}>
          <Route path='/' element={<FrontPage />} />
          <Route path='/signup' element={<Signup />}/>
          <Route path='/login' element={<Login setLoginStatus={setLoginStatus} setUser={setUser}/>}/>
          <Route path='/repos' element={<Repos data={repos} viewRepo={handleViewRepo} repoData={data} image={imageData}/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
