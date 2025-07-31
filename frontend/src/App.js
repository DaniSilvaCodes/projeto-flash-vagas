import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

//Componetes
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Container from './components/layout/Container'
import Message from './components/layout/Message';

// Páginas
import Login from './components/pages/Auth/Login'
import Register from './components/pages/Auth/Register'
import Home from './components/pages/Home'
import Profile from './components/pages/User/Profile'
import MyServices from './components/pages/Service/MyServices'
import AddService from './components/pages/Service/AddService'
import EditService from './components/pages/Service/EditService'
import ServiceDetails from './components/pages/Service/ServiceDetails'
import MyActivities from './components/pages/Service/Myactivities'


//MyActivities

//Contexto de usuário
import { UserProvider } from './context/UserContext'

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Message />
        <Container>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/service/myservices" element={<MyServices />} />
            <Route path="/service/add" element={<AddService />} />
            <Route path="/service/edit/:id" element={<EditService />} />
            <Route path="/service/myactivities" element={<MyActivities />} />
            <Route path="/service/:id" element={<ServiceDetails />} />

            <Route path="/" element={<Home />} />
          </Routes>
        </Container>
        <Footer />
      </UserProvider>
    </Router>
  )
}

export default App
