import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAssignmentWithID } from "../services/commonServies";
import Loader from "./loader";

const AssignmentStudentList = (props: any) => {
  const { assignment } = props;
  let maxMarks = assignment.answers.length;
  const [filteredAssignment, setFilteredAssignment] = useState<any>([]);

  let navigate = useNavigate();

  useEffect(() => {
    getAssignment();
  }, [assignment.id]);

  const getAssignment = async () => {
    debugger;
    try {
      let assignments = await getAssignmentWithID(assignment.id);
      maxMarks = assignments.assignment.answers.length;
      setFilteredAssignment(assignments.assignment);
    } catch (error) {}
  };

  const viewStudentDetails = () => {
    navigate("assignment-details", {
      state: { assignmentId: assignment.id, assignment: filteredAssignment },
    });
  };

  return (
    <>
      <div className="card m-3">
        <div className="card-body text-start">
          <div>
            <label className="col-3">Title:</label>
            <label className="col-9">{assignment.title}</label>
          </div>
          <div>
            <label className="col-3">Class:</label>
            <label className="col-9">{assignment.classId}</label>
          </div>
          <div>
            <label className="col-3">Subject:</label>
            <label className="col-9">{assignment.subject}</label>
          </div>
        </div>
        <div className="assignment-card-button">
          <button
            type="button"
            style={{
              width: "-webkit-fill-available",
            }}
            onClick={() => viewStudentDetails()}
            className="btn btn-outline-primary p-2 mx-3">
            View more details
          </button>
        </div>
        <div className="list-group m-3 student-list">
          {filteredAssignment?.students?.map((student: any) => {
              return (
                <div key={student.studentId} className="list-group-item list-group-item-action">
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{student.studentName}</h5>
                    <span className="badge bg-primary rounded-pill d-flex align-items-center">
                      {student.marks} / {maxMarks}
                    </span>
                  </div>
                </div>
              );
            })}
          {!filteredAssignment && <Loader />}
        </div>

      </div>
    </>
  );
};
export default AssignmentStudentList;
