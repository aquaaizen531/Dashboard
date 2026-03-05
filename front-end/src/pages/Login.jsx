import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Bg.css";
import "../css/login.css";
import loginbg from "../assets/bg/login_cover.png";
import logo from "../assets/logo/drubelabs.png";
import { toast } from "react-toastify";
import axios from "../config/axios.config";
import { useUserDetails } from "../context/UserContext";

const Login = () => {
  const { setuserDetails } = useUserDetails();
  const [formvalue, setformvalue] = useState({
    email: "",
    password: "",
  });
  const [err, seterr] = useState({});
  const [submitted, setsubmitted] = useState(false);
  const navigate = useNavigate();
  const validate = (value) => {
    const errs = {};
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!value.email) {
      errs.email = "This Feild can't be empty!";
    } else if (!emailRegex.test(value.email)) {
      errs.email = "Enter a valid Email!";
    }
    if (!value.password) {
      errs.password = "This Feild can't be empty!";
    } else if (value.password.length < 8) {
      errs.password = "Password must be atleast 8 characters";
    }
    return errs;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setformvalue({ ...formvalue, [name]: value });
    seterr({ ...err, [name]: "" });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setsubmitted(true);
    const errors = validate(formvalue);
    if (Object.keys(errors).length > 0) {
      seterr(errors);
      setsubmitted(false);
      toast.error("Please fill the form correctly!");
      return;
    }
    seterr({});
    const toastId = toast.loading("Signing in...");
    await axios
      .post("/login", formvalue, { withCredentials: true })
      .then((res) => {
        toast.update(toastId, {
          render: "welcome",
          type: "success",
          isLoading: false,
          autoClose: 1500,
        });
        localStorage.setItem("userId", res.data.user.id);
        setuserDetails(res.data.user);
        navigate("/");
      })
      .catch((error) => {
        if (error.response) {
          toast.update(toastId, {
            render: error.response.data.message || "Something went wrong!",
            type: "error",
            isLoading: false,
            autoClose: 1000,
          });
        } else {
          toast.update(toastId, {
            render: "Something went wrong!",
            type: "error",
            isLoading: false,
            autoClose: 1000,
          });
        }
        setsubmitted(false);
      });
  };
  return (
    <div>
      <div
        className=" min-h-screen w-screen relative bg-cover bg-center bg-[#ffffff] "
        // style={{ backgroundImage: `url(${loginbg})` }}
      >
        <div className="bg-amber-50">
          <a
            href="https://drubelabs.com/"
            className=" no-underline hover:text-red-500 text-md sm:text-2xl md:text-3xl lg:text-5xl w-fit"
          >
            <img
              src={logo}
              alt="D-RubeLabs"
              className="absolute h-[20px] md:h-[40px] m-1 md:m-5 "
            />
          </a>
        </div>
        <div className="relative z-10 flex items-center justify-center w-full h-screen  ">
          <div className="bg-[#111419] w-[80%] h-[70%] lg:h-[80%] rounded-xl parent shadow-2xl border-0 overflow-hidden ">
            <div
              className="relative h-full hide-mobile w-[40%] sm:w-[45%] md:w-[50%] lg:w-[60%] rounded--xl bg-cover"
              style={{
                backgroundImage: `url(${loginbg})`,
                backgroundSize: "130%",
                backgroundPosition: " center",
              }}
            >
              <a
                href="https://drubelabs.com/"
                className=" no-underline hover:text-red-500 text-md sm:text-2xl md:text-3xl lg:text-5xl w-fit"
              >
                <p className="text-black text-2xl m-5 font-[700] font-[Poppins] ">
                  SCOUT E750
                </p>
              </a>
            </div>
            <div className=" child-b w-[60%] sm:w-[55%] md:w-[50%] lg:w-[40%] flext-1 text-white flex flex-col gap-5 justify-center items-center ">
              <h3 className=" text-lg sm:text-xl md:text-2xl lg:text-4xl font-[700] font-[Poppins] ">
                Sign In
              </h3>
              <form
                noValidate
                className=" pr-5 sm:pr-7 md:pr-10 lg:pr-20 pl-5 sm:pl-7 md:pl-10 lg:pl-20 input-parent"
                onSubmit={handleSubmit}
              >
                <div className="mb-2">
                  <label htmlFor="email" className="inpt-label">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your Email"
                    required
                    className="input-box"
                    value={formvalue.email}
                    onChange={handleChange}
                  />
                  {err.email && (
                    <p className="text-red-500 text-sm mt-1">{err.email}</p>
                  )}
                </div>
                <div className="mb-2">
                  <label htmlFor="password" className="inpt-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your Password"
                    required
                    className="input-box"
                    value={formvalue.password}
                    onChange={handleChange}
                  />
                  {err.password && (
                    <p className="text-red-500 text-sm mt-1">{err.password}</p>
                  )}
                </div>
                <div className="flex justify-end mb-2 text-[#f5f5f5] cursor-pointer text-sm hover:underline">
                  <span className="relative right-0 text-[10px] sm:text-xs md:text-sm lg:text-base">
                    Forgot Password
                  </span>
                </div>
                <button
                  className={`login-btn ${
                    submitted
                      ? "disabled cursor-not-allowed !bg-[#0843e693]"
                      : ""
                  }`}
                  type="submit"
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
