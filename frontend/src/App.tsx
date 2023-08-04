import "./App.css";
import LoginPage from "./pages/loginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddAssignment from "./pages/addAssignment";
import ToastContext from "./toastContext";
import { useState } from "react";
import Toast from "./components/toast";
import TeacherDashboard from "./pages/teacherDashboard";
import StudentsMarks from "./pages/studentsMarks";
import StudentDashboard from "./pages/studentDashboard";
import AttemptAssignment from "./pages/attempt-assignment";
import SignupPage from "./pages/signupPage";
import { ToastType } from "./constants";

function App() {
  const [dataFromChild, setDataFromChildFunc] = useState<Toast>({
    details: "",
    showToast: false,
    title: "",
    type: ToastType.NOTHING,
  });

  const setDataFromChild = (toast: Toast, time: number) => {
    setDataFromChildFunc(toast);
    setTimeout(() => {
      setDataFromChildFunc({
        details: "",
        showToast: false,
        title: "",
        type: ToastType.NOTHING,
      });
    }, time*1000);
  }

  return (
    <>
      <ToastContext.Provider value={{ dataFromChild, setDataFromChild }}>
        <Router>
          <Routes>
            <Route path="/" Component={LoginPage} />
            <Route path="/student-marks" Component={StudentsMarks} />
            <Route path="/student-dashboard" Component={StudentDashboard} />
            <Route path="/student-dashboard/attempt-assignment" Component={AttemptAssignment} />
            <Route path="/add-assignment" Component={AddAssignment} />
            <Route path="/edit-assignment" Component={AddAssignment} />
            <Route path="/teacher-dashboard" Component={TeacherDashboard} />
            <Route path="/teacher-dashboard/assignment-details" Component={StudentsMarks} />
            <Route path="/login" Component={LoginPage} />
            <Route path="/signup" Component={SignupPage} />
          </Routes>
        </Router>
      </ToastContext.Provider>
      <Toast
        title={dataFromChild.title}
        details={dataFromChild.details}
        showToast={dataFromChild.showToast}
        type={dataFromChild.type}
      />
    </>
  );
}

export default App;
