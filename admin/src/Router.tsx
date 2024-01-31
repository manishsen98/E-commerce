import { createBrowserRouter, useNavigate } from "react-router-dom";
import Home from "./pages/home/Home";
import { UnAuthLayout } from "./Layout";
import SignupForm from "./pages/signup/SignUp";
import SignInForm from "./pages/signin/SignIn";
import AuthLayout from "./Layout";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import useApi from "./hooks/useApi";
import { saveAdmin } from "./store/admin/adminSlice";

const ProtectedRoute = ({ children }) => {
  const { admin } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getAdmin = async () => {
    if (!admin) {
      console.log("protected,admin", admin);
      try {
        console.log("getting admin from local token");
        const data = await useApi
          .get("/auth/admin/get")
          .then((res) => res.data);
        dispatch(saveAdmin(data));
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getAdmin();
    if (!admin) {
      navigate("/auth/signin");
    } else {
      navigate("/");
    }
  }, []);

  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AuthLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/auth",
    element: <UnAuthLayout />,
    children: [
      {
        path: "/auth/signup",
        element: <SignupForm />,
      },
      {
        path: "/auth/signin",
        element: <SignInForm />,
      },
    ],
  },
]);

export default router;
