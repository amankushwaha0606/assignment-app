import { ChangeEvent, useContext, useState } from "react";
import { studentSignup } from "../services/commonServies";
import { Link, useNavigate } from "react-router-dom";
import { studentClasses } from "../services/commonServies";
import ToastContext from "../toastContext";
import { ToastType } from "../constants";

const SignupPage = () => {

  const classes = studentClasses;

  let navigate = useNavigate();

  const { setDataFromChild } = useContext(ToastContext);
  const showToast = (message: Toast) => {
    setDataFromChild(message, 3);
  };

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    email: "",
    Class: 0,
  });

  const [isStudent, changeUserType] = useState(false);

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

  const studentSignupFunc = async (e: any) => {
    e.preventDefault();

    if(validateForm()) {
      let userType = isStudent ? "student" : "teacher";
      try {
        const userData = await studentSignup(userType, formData);
        if (userData.status == 200) {
          console.log("User created Successfully");
          navigate("/login");
        } else {
          console.log("Something went worng");
        }
      } catch (error: any) {
        console.log(error.message);
      }
    }
  };

  const handleClassChange = (selectedClass: number) => {
    setFormData((prevData) => ({
      ...prevData,
      Class: selectedClass,
    }));
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
        <form onSubmit={studentSignupFunc} className="login-signup-shadow">
          <h2 className="mb-4">Signup</h2>
          <div className="form-group my-2">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Please enter your name here"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="row d-flex justify-content-between">
            <div style={{ width: "auto" }}>
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
            {isStudent && (
              <div className="form-group" style={{ width: "auto" }}>
                <label htmlFor="class" className="mx-2">
                  Class
                </label>
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-primary dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    {formData.Class ? formData.Class : "Class"}
                  </button>
                  <ul className="dropdown-menu scrollable-dropdown">
                    {classes.map((studentClass) => (
                      <li
                        key={studentClass.value}
                        onClick={() => handleClassChange(studentClass.value)}>
                        <a className="dropdown-item">{studentClass.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
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
          <button type="submit" className="btn my-2 btn-primary col-12">
            Signup
          </button>
          <label>Aready have an account! <Link to="/login">Login now</Link></label>
        </form>
      </div>
    </>
  );
};

export default SignupPage;
