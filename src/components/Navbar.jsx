import { getAuth, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { app, useFirebase } from "../context/firebase";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const firebase = useFirebase();

  const [loggedIn, setloggedIn] = useState(firebase.loggedIn);
  const user=firebase.currentUser
  const auth = getAuth(app);
  const navigate = useNavigate();

  useEffect(() => {
    setloggedIn(firebase.loggedIn);
  });

  const handleSignOut = () => {
    navigate("/");
    setloggedIn(false);
    signOut(auth);
  };
  return (
    <div>
      <nav class="navbar navbar-expand-lg " style={{backgroundColor:"black",color:'white'}}>
        <div class="container-fluid">
          <Link class="navbar-brand" to="/" style={{color:'white'}}>
            Event Management System
          </Link>
          <button
            class="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{border:'none'}}
          >
            <span class="navbar-toggler-icon"  style={{ filter: 'invert(1)'}}></span>
          </button>
          <div
            class="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul class="navbar-nav" >
              <li class="nav-item">
                <Link class="nav-link" to="/"style={{color:'white'}}>
                  Home
                </Link>
              </li>
              <li class="nav-item">
                {!loggedIn && !user&&(
                  <Link class="nav-link" to="/register-admin"style={{color:'white'}}>
                    Register-Admin
                  </Link>
                )}
              </li>
              <li class="nav-item">
                {!loggedIn && !user&&(
                  <Link class="nav-link" to="/login-admin"style={{color:'white'}}>
                    Login-Admin
                  </Link>
                )}
              </li>
              <li class="nav-item">
                {!loggedIn && !user&&(
                  <Link class="nav-link" to="/register-user"style={{color:'white'}}>
                    Register-User
                  </Link>
                )}
              </li>
              <li class="nav-item">
                {!loggedIn && !user&& (
                  <Link class="nav-link" to="/login-user"style={{color:'white'}}>
                    Login-User
                  </Link>
                )}
              </li>
              <li class="nav-item">
                {loggedIn && firebase.currentRole === "user" ? (
                  <Link class="nav-link active" to="/user-dashboard"style={{color:'white'}}>
                    My Dashboard
                  </Link>
                ) : (
                  loggedIn && (
                    <Link class="nav-link" to="/admin-dashboard"style={{color:'white'}}>
                      My Dashboard
                    </Link>
                  )
                )}
              </li>
              <li class="nav-item">
                {loggedIn && (
                  <button
                    class="nav-link active"
                    onClick={() => handleSignOut()}
                    style={{color:'white'}}
                  >
                    Logout
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
