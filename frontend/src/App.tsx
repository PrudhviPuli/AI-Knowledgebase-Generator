import Navbar from './components/navbar'
import FrontPage from './pages/frontpage'
import Signup from './pages/signup'
import Login from './pages/login'
import './css/App.css'
import {HashRouter as Router, Routes, Route} from 'react-router-dom'

function App() {

  return (
    <>
      <Routes>
        <Route element={<Navbar />}>
          <Route path='/' element={<FrontPage />} />
          <Route path='/signup' element={<Signup />}/>
          <Route path='/login' element={<Login />}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
