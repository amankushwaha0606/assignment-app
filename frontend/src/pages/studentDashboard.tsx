import { useEffect, useState } from "react";
import {
  getStudentsAssignments,
  setStudentDetails,
  getStudentsAttemptedAssignments,
  logout
} from "../services/commonServies";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {

  let navigate = useNavigate();

  const [filteredAssignment, setFilteredAssignment] = useState<any>([]);
  const [attemptedAssignment, setAttemptedAssignment] = useState<any>([]);
  const [studentDetails, setStudentDetailsFunc] = useState<any>({});
  let allAssignments: any = [];
  let allAttempted: any = [];

  useEffect(() => {
    getAllAssignments();
  }, []);

  const getAllAssignments = async () => {
    try {
      let res = await getStudentsAssignments();
      setFilteredAssignment(res.data);
      setStudentDetails(res.studentDetails);
      setStudentDetailsFunc(res.studentDetails);
      allAssignments = [...res.data];
    } catch (error) { }
  };

  const getAttemptedAssignments = async () => {
    try {
      let res = await getStudentsAttemptedAssignments(
        studentDetails.id
      );
      setAttemptedAssignment(res.data);
      allAttempted = [...res.data];
    } catch (error) { }
  };

  const onSearch = (e: any, isAttemptedTab: boolean) => {
    debugger;
    console.log('onSearch ---- ', onSearch)
    const searchString = e.target.value;
    let assignmentsList = [];

    if (isAttemptedTab) {
      assignmentsList = [...allAttempted];
    } else {
      assignmentsList = [...allAssignments];
    }
    const filtered = assignmentsList.filter(
      (asm: { [key: string]: any }) => {
        for (const prop in asm) {
          if (
            asm[prop]
              .toString()
              .toLowerCase()
              .includes(searchString.toLowerCase())
          ) {
            return true;
          }
        }
        return false;
      }
    );

    if (isAttemptedTab) {
      setAttemptedAssignment(filtered);
    } else {
      setFilteredAssignment(filtered);
    }
  };

  const attemptAssignment = (assignment: any) => {
    navigate("attempt-assignment", { state: assignment.id });
  };

  const logoutStudent = () => {
    logout();
    navigate('/login');
  }

  return (
    <>
      <div className="container">
        <div className="logout-div">
          <div className="card my-4">
            <h3 className="card-body">Student Dashboard</h3>
          </div>
          <button
            type="button"
            onClick={() => logoutStudent()}
            className="btn btn-outline-primary p-2">
            Log out
          </button>
        </div>

        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              id="home-tab"
              data-bs-toggle="tab"
              data-bs-target="#home-tab-pane"
              type="button"
              role="tab"
              aria-controls="home-tab-pane"
              aria-selected="true"
              onClick={getAllAssignments}>
              Assignments
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="attempted-tab"
              data-bs-toggle="tab"
              data-bs-target="#attempted-tab-pane"
              type="button"
              role="tab"
              aria-controls="attempted-tab-pane"
              aria-selected="false"
              onClick={getAttemptedAssignments}>
              Attempted Assignments
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="profile-tab"
              data-bs-toggle="tab"
              data-bs-target="#profile-tab-pane"
              type="button"
              role="tab"
              aria-controls="profile-tab-pane"
              aria-selected="false">
              Profile
            </button>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="home-tab-pane"
            role="tabpanel"
            aria-labelledby="home-tab">
            <div className="mt-4 d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={(e) => onSearch(e, false)}
              />
            </div>
            <div className={`justify-content-center row py-4`}>
              <div className={`row parent-div col-12`}>
                {filteredAssignment.map((queObj: any) => {
                  return (
                    <div
                      key={queObj.id}
                      className="card card-height student-dashboard-card"
                      onClick={() => attemptAssignment(queObj)}>
                      <div className="card-body text-start">
                        <div>
                          <label className="col-3">Title:</label>
                          <label className="col-9">{queObj.title}</label>
                        </div>
                        <div>
                          <label className="col-3">Uploaded on:</label>
                          <label className="col-9">{queObj.createdAt}</label>
                        </div>
                        <div>
                          <label className="col-3">Subject:</label>
                          <label className="col-9">{queObj.subject}</label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade show"
            id="attempted-tab-pane"
            role="tabpanel"
            aria-labelledby="attempted-tab">
            <div className="mt-4 d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={(e) => onSearch(e, true)}
              />
            </div>
            <div className={`justify-content-center row py-4`}>
              <div className={`row parent-div col-12`}>
                {attemptedAssignment.map((queObj: any) => {
                  return (
                    <div
                      key={queObj.id}
                      className="card card-height">
                      <div className="card-body text-start">
                        <div>
                          <label className="col-3">{queObj.assignment_title}</label>
                          <label className="col-1">{queObj.marks}</label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="profile-tab-pane"
            role="tabpanel"
            aria-labelledby="profile-tab">
            <div className="m-5">
              <div className="d-flex w-100">
                <h5 className="mb-1 col-3">Name</h5>
                <h5 className="mb-1 col-3">{studentDetails.name}</h5>
              </div>
              <div className="d-flex w-100">
                <p className="mb-1 col-3">Email</p>
                <p className="mb-1 col-3">{studentDetails.email}</p>
              </div>
              <div className="d-flex w-100">
                <small className="col-3">{studentDetails.Class}</small>
                <small className="col-3">10</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
