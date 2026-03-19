import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import axios from "../config/axios.config";
const ProtectedRoutes = () => {
  const navigate = useNavigate();
  const [auth, setauth] = useState(null);
  useEffect(() => {
    const ckeckAuth = () => {
      try {
        axios
          .post("/authenticate/me")
          .then((res) => {
            if (res.status === 200) {
              setauth(true);
            } else {
              setauth(false);
            }
          })
          .catch((err) => {
            console.log(err);
            setauth(false);
          });
      } catch (error) {
        console.log(error);
        setauth(false);
      }
    };
    ckeckAuth();
  }, [navigate]);
  if (auth === null) {
    return <div>Loading...</div>;
  }
  if (auth === true) {
    return <Outlet />;
  }
  if (auth === false) {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoutes;
