import React from "react";

const ErrorPage = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <h1 style={{ color: "red" }}>Error 404</h1>
      <h6>The Page You are looking for is not found</h6>
      <p>Logout and Login again</p>
    </div>
  );
};

export default ErrorPage;
