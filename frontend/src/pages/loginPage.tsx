import { ChangeEvent, useContext, useState } from "react";
import { studentLogin, setToken } from "../services/commonServies";
import { Link, useNavigate } from "react-router-dom";
import ToastContext from "../toastContext";
import { ToastType } from "../constants";

const LoginPage = () => {

  let navigate = useNavigate();

  const { setDataFromChild } = useContext(ToastContext);
  const showToast = (message: Toast) => {
    setDataFromChild(message, 3);
  };

  const [isStudent, changeUserType] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    email: "",
  });

  const validateForm = () => {
    if (!formData.email.trim()) {
      showToast({
        details: "Email is required",
        showToast: true,
        title: "Email",
        type: ToastType.ERROR
      });
      return false;
    }

    if (!formData.password.trim()) {
      showToast({
        details: "Password is required",
        showToast: true,
        title: "Password",
        type: ToastType.ERROR
      });
      return false;
    }
    return true;
  };

  const studentLoginFunc = async (e: any) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        let userType = isStudent ? "student" : "teacher";
        const userData = await studentLogin(userType, formData);
        if (userData.status) {
          setToken(userData);
          if (userData.role == "student") {
            navigate("/student-dashboard");
          } else {
            navigate("/teacher-dashboard");
          }
        } else {
        }
      } catch (error) { }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="col-3 login-signup">
        <form onSubmit={studentLoginFunc} className="login-signup-shadow">
          <h2 className="mb-4">Login</h2>
          <div className="form-group my-2">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              className="form-control"
              id="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group my-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group my-2">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="flexCheckChecked"
              checked={isStudent}
              onChange={() => changeUserType(!isStudent)}
            />
            <label className="form-check-label mx-2" htmlFor="flexCheckChecked">
              Are you a student
            </label>
          </div>
          <button type="submit" className="btn my-2 btn-primary col-12">
            Login
          </button>
          <label>Don't have an account? <Link to="/signup">Create account</Link></label>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
