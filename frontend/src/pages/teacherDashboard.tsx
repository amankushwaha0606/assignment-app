import { useEffect, useState } from "react";
import AssignmentStudentList from "../components/assignmentStudentList";
import { getAllTeacherAssignments, logout } from "../services/commonServies";
import { useNavigate } from "react-router-dom";
import Loader from "../components/loader";

// interface assignmentInterface {
//   title: string;
//   class: number;
//   id: number;
//   subject: string;
//   assignmentQuestion: [
//     {
//       question: string;
//       options: [];
//       answer: number;
//     }
//   ];
// }

const TeacherDashboard = () => {

  let navigate = useNavigate();

  const [filteredAssignment, setFilteredAssignment] = useState([]);
  const [showAssignmentStudent, showAssignmentStudentFunc] = useState(false);
  const [selectedAssignment, selectAssignmentFunc] = useState<any>();

  useEffect(() => {
    getAllAssignments();
  }, []);

  const getAllAssignments = async () => {
    try {
      let assignments = await getAllTeacherAssignments();
      setFilteredAssignment(assignments.assignments);
    } catch (error) { }
  };

  const showAssignmentDetails = (queObj: any) => {
    debugger
    if (showAssignmentStudent && selectedAssignment?.id == queObj.id) {
      showAssignmentStudentFunc(false);
    } else {
      showAssignmentStudentFunc(true);
      selectAssignmentFunc(queObj);
    }
  };

  const onSearch = (e: any) => {
    const searchString = e.target.value;

    const filtered = filteredAssignment.filter(
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
    setFilteredAssignment(filtered);
  };

  const addAssignment = (assignmentId?: number) => {
    navigate("/edit-assignment", { state: assignmentId });
  };

  const logoutTeacher = () => {
    logout();
    navigate('/login');
  }

  return (
    <>
      <div className="container">
        <div className="logout-div">
          <div className="card my-4">
            <h3 className="card-body">Teacher Dashboard</h3>
          </div>
          <button
            type="button"
            onClick={() => logoutTeacher()}
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
              aria-selected="true">
              Assignments
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
                onChange={onSearch}
              />
              <button
                type="button"
                style={{ maxWidth: "200px", width: "-webkit-fill-available" }}
                onClick={() => addAssignment()}
                className="btn btn-outline-primary p-2">
                Add Assignment
              </button>
            </div>
            <div className={`justify-content-center row py-4`}>
              <div
                className={
                  `row parent-div ` +
                  (showAssignmentStudent ? "col-8" : "col-12")
                }>
                {filteredAssignment.map((queObj: any) => {
                  return (
                    <div
                      key={queObj.id}
                      className="card card-height teacher-dashboard-card"
                      onClick={() => showAssignmentDetails(queObj)}>
                      <div className="card-body text-start">
                        <div>
                          <label className="col-3">Title:</label>
                          <label className="col-9">{queObj.title}</label>
                        </div>
                        <div>
                          <label className="col-3">Class:</label>
                          <label className="col-9">{queObj.classId}</label>
                        </div>
                        <div>
                          <label className="col-3">Subject:</label>
                          <label className="col-9">{queObj.subject}</label>
                        </div>
                      </div>
                      <div className="assignment-card-button">
                        <button
                          type="button"
                          style={{
                            width: "-webkit-fill-available",
                            marginBottom: "15px"
                          }}
                          onClick={() => addAssignment(queObj.id)}
                          className="btn btn-outline-primary p-2">
                          Edit Assignment
                        </button>
                      </div>
                    </div>
                  );
                })}
                {!filteredAssignment && <Loader />}
              </div>
              <div className="col-4">
                {showAssignmentStudent && (
                  <AssignmentStudentList assignment={selectedAssignment} />
                )}
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
                <h5 className="mb-1 col-3">Teacher Name</h5>
              </div>
              <div className="d-flex w-100">
                <p className="mb-1 col-3">Email</p>
                <p className="mb-1 col-3">teacher1@gmail.com</p>
              </div>
              <div className="d-flex w-100">
                <small className="col-3">Total Assignments</small>
                <small className="col-3">10</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherDashboard;
