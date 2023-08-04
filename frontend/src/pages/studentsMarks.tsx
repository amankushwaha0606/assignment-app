import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAssignmentWithID } from "../services/commonServies";

const StudentsMarks = () => {

  const location = useLocation();
  const { assignmentId, assignment } = location.state;
  const maxMarks = assignment.answers.length;

  const [questions, questionChange] = useState([
    { question: "", options: [""], answer: -1 },
  ]);
  const [studentAnswers, setStudentAnswers] = useState(assignment.students[0].answers)
  const [selectedStudentId, setSelectedStudentId] = useState(0)

  useEffect(() => {
    getAssignment();
  }, []);

  const getAssignment = (std?: any) => {
    debugger;
    if (std) {
      setSelectedStudentId(std.studentId);
      setStudentAnswers(std.answers);
      return;
    }
    getAssignmentWithID(assignmentId).then((data) => {
      if (data.status == 200) {
        data = data.assignment;
        let ansLen = data.answers.length;
        let tempQuestions: any = [];
        for (let i = 0; i < ansLen; i++) {
          let tempQuestion = {
            question: data.questions[i].question,
            options: data.questions[i].options,
            answer: data.answers[i],
          };
          tempQuestions.push(tempQuestion);
        }
        questionChange(tempQuestions);
      }
    });
  };

  return (
    <>
      <div className="d-flex justify-content-center col-11">
        <div className="list-group m-3 col-4 student-detail-list">
          {assignment.students.map((student: any) => {
            return (
              <a key={student.studentId} className="list-group-item list-group-item-action" style={{ backgroundColor: student.studentId == selectedStudentId ? 'lightskyblue' : '' }} onClick={() => getAssignment(student)}>
                <div className="d-flex w-100 justify-content-between">
                  <h6 className="mb-1">{student.studentName}</h6>
                  <span className="badge bg-primary rounded-pill d-flex align-items-center">
                    {student.marks} / {maxMarks}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
        <div className="col-8" style={{ right: '0px', position: 'absolute' }}>
          <div className="container">
            <div>
              <div className="accordion m-4" id="accordionExample">
                {questions.map((queObj, index) => {
                  return (
                    <div className="accordion-item p-4" key={index}>
                      <h2 className="accordion-header d-flex">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse" + index} aria-expanded="true" aria-controls={"collapse" + index} >
                          Question: {index + 1} {studentAnswers.length <= index || studentAnswers[index] < 0 ? '[ Not attempted ]' : ''}
                        </button>
                      </h2>
                      <div id={"collapse" + index} className="accordion-collapse collapse show">
                        <div className="accordion-body">
                          <div className="form-control list-group-item" id={`question-${index}`} />
                          <div
                            className="form-control my-2"
                            id={`question-${index}`}>
                            <strong>{`Question ${index + 1}. `}</strong>
                            {queObj.question}
                          </div>
                          {queObj.options.map((option, optIndex) => {
                            return (
                              <div
                                className={`form-control mb-1 ` + ((optIndex === queObj.answer ? "right-answer" : ((studentAnswers[index] >= 0 && optIndex == studentAnswers[index]) ? "wrong-answer" : "")))}
                                id={`option-${index}-${optIndex}`}>
                                <strong>{`Option ${optIndex + 1}.  `}</strong>
                                {option}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentsMarks;
