import React, { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useFirebase } from "../context/firebase";
const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const firebase = useFirebase();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.includes("admin");
  const handleRegister = async () => {
    if (isAdmin) {
      const result = await firebase.register(name, email, password, "admin");
      if (result.user) {
        alert("Admin registered Successfully..Please Login");
        navigate("/login-admin");
      } else alert("There is some error try again");
    } else {
      const result = await firebase.register(name, email, password, "user");
      if (result.user) {
        alert("User registered Successfully..Please Login");
        navigate("/login-user");
      } else alert("There is some error try again");
    }
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <div className="card mt-5 p-3 w-50" style={{ margin: "auto" }}>
        <h6 className="text-center">{!isAdmin ? "User" : "Admin"} Register To Your Account </h6>
        <div>
          <div className="mb-3">
            <label for="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label for="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label for="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary"
            style={{ width: "100%" }}
            onClick={handleRegister}
          >
            Submit
          </button>
        </div>
        <p className="mt-3">
          Already Have An Account?
          <Link to={`/login-${isAdmin ? "admin" : "user"}`}>Login</Link>
        </p>
      </div>
    </>
  );
};

export default RegisterPage;
