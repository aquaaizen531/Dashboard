import React, { useEffect, useState } from "react";
import logo from "@/assets/logo/drubelabs.png";
import { useNavigate } from "react-router-dom";
import { Card, Typography } from "@material-tailwind/react";
import { useUserDetails } from "@/context/UserContext";
import axios from "@/config/axios.config";
import { toast } from "react-toastify";

const Profile = () => {
  const navigate = useNavigate();
  const { userDetails, mefetch } = useUserDetails();
  const [formvalue, setformvalue] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const id = localStorage.getItem("userId");
  const [passworderr, setpassworderr] = useState("");
  const [initialvalue, setinitialvalue] = useState(null);
  useEffect(() => {
    if (userDetails) {
      const initial = {
        name: userDetails.name || "",
        email: userDetails.email || "",
        phone: userDetails.phone || "",
        password: "",
        confirmPassword: ""
      };
      setformvalue(initial);
      setinitialvalue(initial);
    }
  }, [userDetails]);
  const isChanged = () => {
    if (!initialvalue) return false;
    return (
      formvalue.name !== initialvalue.name ||
      formvalue.email !== initialvalue.email ||
      formvalue.phone !== initialvalue.phone ||
      formvalue.password.length > 0
    );
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setformvalue((prev) => {
      const updated = {
        ...prev,
        [name]: value
      };
      if (
        updated.password &&
        updated.confirmPassword &&
        updated.password !== updated.confirmPassword
      ) {
        setpassworderr("Password and Confirm Password do not match");
      } else {
        setpassworderr("");
      }
      return updated;
    });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const updatedFormValue = {
      name: formvalue.name,
      email: formvalue.email,
      phone: formvalue.phone,
      password: formvalue.password
    };

    axios
      .put(`/updateProfile/${id}`, updatedFormValue)
      .then(() => {
        toast.success("Profile updated successfully!");
        mefetch();
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response?.data?.message || "Error updating profile");
      });
  };
  const handleCancel = () => {
    setformvalue(initialvalue);
    setpassworderr("");
    navigate("/");
  };
  return (
    <div className=" relative w-full bg-cover bg-center var(--card-bg-color) h-screen ">
      <div className=" absolute sm:m-3 md:m-5 lg:m-6 flex items-center">
        <img
          onClick={() => navigate("/")}
          src={logo}
          alt="DrubeLabs"
          className=" inver t-100 h-6 sm:h-7 md:h-8 lg:h-10 transition-all"
        />
      </div>
      <div className=" absolute overflow-y-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-3xl max-h-[90%] m-auto p-4 max-p-8 rounded-lg shadow-lg bg-[var(--card-bg-color)] ">
        <Card
          color="transparent"
          shadow={false}
          className=" w-full sm:p-2 md:p-4 lg:p-5 "
        >
          <Typography
            color="blue-gray"
            className="text-center font-semibold text-xl sm:text-lg md:text-xl lg:text-3xl"
          >
            Profile
          </Typography>
          <form className=" mt-auto " onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-1 md:gap-2 lg:gap-3 ">
              <div className="">
                <label className="flex items-center font-semibold text-xs sm:text-sm md:text-md text-[var(--text-color)] ">
                  User Name
                </label>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={formvalue.name}
                  className="mb-2 w-full p-2 sm:p-1 md:p-2 lg:p-3 text-sm sm:text-xs md:text-sm lg:text-base bg-[var(--dropdown-bg-color)] text-[var(--text-color)] rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="">
                <label className="flex items-center font-semibold text-xs sm:text-sm md:text-md text-[var(--text-color)]">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  onChange={handleChange}
                  value={formvalue.email}
                  className="mb-2 w-full p-2 sm:p-1 md:p-2 lg:p-3 text-sm sm:text-xs md:text-sm lg:text-base bg-[var(--dropdown-bg-color)] text-[var(--text-color)] rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="">
                <label className="flex items-center font-semibold text-xs sm:text-sm md:text-md text-[var(--text-color)] ">
                  Phone
                </label>
                <input
                  type="number"
                  name="phone"
                  onChange={handleChange}
                  value={formvalue.phone}
                  className="mb-2 w-full p-2 sm:p-1 md:p-2 lg:p-3 text-sm sm:text-xs md:text-sm lg:text-base bg-[var(--dropdown-bg-color)] text-[var(--text-color)] rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="">
                <label className="flex items-center font-semibold text-xs sm:text-sm md:text-md text-[var(--text-color)]">
                  Role
                </label>
                <div className="mb-2 w-full p-2 sm:p-1 md:p-2 lg:p-3 text-sm sm:text-xs md:text-sm lg:text-base bg-[var(--dropdown-bg-color)] text-[var(--text-color)] rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  {userDetails?.role || "role"}
                </div>
              </div>
              <div className="">
                <label className="flex items-center font-semibold text-xs sm:text-sm md:text-md text-[var(--text-color)]">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={formvalue.password}
                  placeholder="********"
                  className="mb-2 w-full p-2 sm:p-1 md:p-2 lg:p-3 text-sm sm:text-xs md:text-sm lg:text-base bg-[var(--dropdown-bg-color)] text-[var(--text-color)] rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="">
                <label className="flex items-center font-semibold text-xs sm:text-sm md:text-md text-[var(--text-color)]">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  onChange={handleChange}
                  value={formvalue.confirmPassword}
                  placeholder="********"
                  className="mb-2 w-full p-2 sm:p-1 md:p-2 lg:p-3 text-sm sm:text-xs md:text-sm lg:text-base bg-[var(--dropdown-bg-color)] text-[var(--text-color)] rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {passworderr.length > 0 && (
                  <span className="block text-xs text-red-500 mb-2 -mt-1">
                    {passworderr}
                  </span>
                )}
              </div>
            </div>
            <div className="row flex justify-center mb-auto mt-auto ">
              <button
                disabled={!isChanged()}
                className={`rounded-md rounded-r-none bg-green-500 py-2 px-4 text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-red-500 disabled:opacity-50 disabled:shadow-none ${
                  !isChanged() ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                type="submit"
              >
                Update
              </button>

              <button
                onClick={handleCancel}
                className={`rounded-md rounded-l-none bg-red-500 py-2 px-4 text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none  disabled:opacity-50 disabled:shadow-none ${"cursor-pointer"}`}
                type="button"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
