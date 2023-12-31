import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CreateEvent from "./pages/CreateEvent";
import ErrorPage from './pages/ErrorPage'
import { useFirebase } from "./context/firebase";
function App() {
  const firebase=useFirebase()
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user-dashboard" element={firebase.currentRole==='user'&&firebase.loggedIn?<UserDashboard />:<ErrorPage/>} />
        <Route path="/login-user" element={<LoginPage />} />
        <Route path="/admin-dashboard" element={firebase.currentRole==='admin'&&firebase.loggedIn?<AdminDashboard />:<ErrorPage/>} />
        <Route path="/register-user" element={<RegisterPage />} />
        <Route path="/login-user" element={<LoginPage />} />
        <Route path="/register-admin" element={<RegisterPage />} />
        <Route path="/login-admin" element={<LoginPage />} />
        <Route path="/create-event" element={firebase.currentRole==='admin'?firebase.loggedIn?<CreateEvent />:<LoginPage/>:<ErrorPage/>} />
        <Route path="/edit-event/:id" element={firebase.currentRole==='admin'?firebase.loggedIn?<CreateEvent />:<LoginPage/>:<ErrorPage/>} />
      </Routes>
    </div>
  );
}

export default App;
