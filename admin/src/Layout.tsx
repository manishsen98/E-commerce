import { Outlet, useNavigate } from "react-router-dom";
// import Header from "./components/header/Header";
import { Toaster } from "./components/ui/toaster";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "./components/header/Header";

const AuthLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Toaster />
    </div>
  );
};

export default AuthLayout;

const UnAuthLayout = () => {
  const { admin } = useSelector((state) => state.admin);
  const navigate = useNavigate();
  useEffect(() => {
    if (admin) {
      navigate("/");
    }
    console.log("first", admin);
  }, [admin]);

  return (
    <div className="h-full w-full flex justify-center items-center">
      <Outlet />
      <Toaster />
    </div>
  );
};

export { UnAuthLayout };
