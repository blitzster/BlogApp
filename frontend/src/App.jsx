import './App.css'
import { HashRouter as Router, Routes, Route } from "react-router-dom"
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { CreateBlog } from './pages/CreateBlog'
import { Home } from './pages/Home'
import { Landing } from './pages/Landing'
import { Profile } from './pages/Profile'
import { ReadBlog } from './pages/ReadBlog'
import { Navbar } from './components/Navbar'
import { Layout } from './components/Layout'

function App() {

  //Pages
  //Landing Page
  //Home Page
  //ReadBlog
  //CreateBlog
  //Profile Page
  //About
  //Contact


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/createblog" element={<CreateBlog />} />
          <Route path="/readblog/:id" element={<ReadBlog />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
