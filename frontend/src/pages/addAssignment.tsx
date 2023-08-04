import { useContext, useEffect, useState } from "react";
import ToastContext from "../toastContext";
import {
  createAssignment,
  getAssignmentWithID,
  studentClasses,
  updateAssignment,
} from "../services/commonServies";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastType } from "../constants";

const AddAssignment = () => {

  const location = useLocation();
  const assignmentId = location.state;
  const classes = studentClasses;

  let navigate = useNavigate();

  const { setDataFromChild } = useContext(ToastContext);
  const showToast = (message: Toast) => {
    setDataFromChild(message, 3);
  };

  useEffect(() => {
    if (assignmentId) {
      getAssignmentForEdit();
    }
  }, [assignmentId]);

  const [questions, questionChange] = useState([
    { question: "", options: [""], answer: -1 },
  ]);

  const [assignmentDetails, setAssignmentDetails] = useState({
    title: "",
    classId: -1,
    subject: "",
  });

  const getAssignmentForEdit = () => {
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
        setAssignmentDetails({
          title: data.title,
          classId: data.classId,
          subject: data.subject,
        });
      } else {

      }
    });
  };

  const assignmentsDetailsFunc = (key: string, value: any) => {
    setAssignmentDetails((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const addQuestion = (questions: any, addOption: number, index: number) => {
    if (addOption === 1) {
      const newQuestion = {
        question: "",
        options: [""],
        answer: -1,
      };
      const newQuestions = [...questions, newQuestion];
      questionChange(newQuestions);
    } else {
      const newOptions = [...questions[index].options, ""];
      const newQuestion = { ...questions[index], options: newOptions };
      const newQuestions = [
        ...questions.slice(0, index),
        newQuestion,
        ...questions.slice(index + 1),
      ];
      questionChange(newQuestions);
    }
  };

  const deleteQuestion = (questions: any, index: number) => {
    if (questions.length <= 1) return;
    const newQuestions = [
      ...questions.slice(0, index),
      ...questions.slice(index + 1),
    ];
    questionChange(newQuestions);
  };

  const editQuestion = (
    questions: any,
    changeOption: number,
    index: number,
    optIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    switch (changeOption) {
      case 0:
        newQuestions[index].options[optIndex] = value;
        break;
      case 1:
        newQuestions[index].question = value;
        break;
      case 2:
        newQuestions[index].answer = optIndex;
        break;
      default:
        break;
    }
    questionChange(newQuestions);
  };

  const saveAssignment = () => {
    let tempSolutions = [];
    let tempQuestions = [];
    debugger;
    for (let que of questions) {
      const { answer, ...rest } = que;
      tempSolutions.push(answer);
      tempQuestions.push(rest);
    }

    let body = {
      ...assignmentDetails,
      questions: tempQuestions,
      answers: tempSolutions,
    };

    if (assignmentId) {
      try {
        updateAssignment(body, assignmentId).then((res) => {
          console.log(res);
          navigate("/teacher-dashboard");
        });
      } catch (error) { }
    } else {
      try {
        createAssignment(body).then((res) => {
          console.log(res);
          navigate("/teacher-dashboard");
        });
      } catch (error) { }
    }
  };

  const checkAssignment = () => {
    for (let index = 0; index < questions.length; index++) {
      const question = questions[index];
      if (!question.question) {
        showToast({
          details: `Check Question ${index + 1
            }. Please fill that question or delete it.`,
          showToast: true,
          title: "Question Empty",
          type: ToastType.ERROR,
        });
        return;
      }
      for (let opt = 0; opt < question.options.length; opt++) {
        if (!question.options[opt]) {
          showToast({
            details: `Check Option ${opt + 1} of question ${index + 1
              }. Please fill that option or delete it.`,
            showToast: true,
            title: "Option Empty",
            type: ToastType.ERROR,
          });
          return;
        }
      }
      if (question.answer < 0) {
        showToast({
          details: `Answer is not ticked for question ${index + 1}`,
          showToast: true,
          title: "Missing Answer",
          type: ToastType.ERROR,
        });
        return;
      }
    }
    saveAssignment();
  };

  return (
    <>
      <div className="container">
        <div>
          <div className="col-12 m-4">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Assignment Title
            </label>
            <input
              type="text"
              className="form-control"
              id="assignment-title"
              placeholder="Assignment Title"
              value={assignmentDetails.title}
              onChange={(e) => assignmentsDetailsFunc("title", e.target.value)}
            />
          </div>
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
                {assignmentDetails.classId > 0
                  ? assignmentDetails.classId
                  : "Class"}
              </button>
              <ul className="dropdown-menu scrollable-dropdown">
                {classes.map((studentClass) => (
                  <li
                    key={studentClass.value}
                    onClick={() =>
                      assignmentsDetailsFunc("classId", studentClass.value)
                    }>
                    <a className="dropdown-item">{studentClass.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-12 m-4">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Subject
            </label>
            <input
              type="text"
              className="form-control"
              id="assignment-title"
              placeholder="Subject"
              value={assignmentDetails.subject}
              onChange={(e) =>
                assignmentsDetailsFunc("subject", e.target.value)
              }
            />
          </div>
          <div className="accordion m-4" id="accordionExample">
            {questions.map((queObj, index) => {
              return (
                <div className="accordion-item p-4" key={index}>
                  <h2 className="accordion-header d-flex">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={"#collapse" + index}
                      aria-expanded="true"
                      aria-controls={"collapse" + index} // Use the same ID as data-bs-target
                    >
                      Question: {index + 1}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteQuestion(questions, index)}
                      className={`btn btn-danger ms-21 ${questions.length <= 1 ? "disabled" : ""
                        }`}>
                      Delete
                    </button>
                  </h2>
                  <div
                    id={"collapse" + index}
                    className="accordion-collapse collapse show">
                    <div className="accordion-body">
                      <textarea
                        className="form-control"
                        id={`question-${index}`}
                        placeholder={`Question: ${index + 1}`}
                        name={`question-${index}`}
                        value={queObj.question}
                        onChange={(e) =>
                          editQuestion(questions, 1, index, -1, e.target.value)
                        }
                      />
                      {queObj.options.map((option, optIndex) => {
                        return (
                          <div
                            key={`${index}-${optIndex}`}
                            className="form-check m-4">
                            <input
                              className="form-check-input"
                              type="radio"
                              name={`radio-${index}`}
                              id={`option-${index}-${optIndex}`} // Use a unique ID for radio inputs
                              checked={questions[index].answer === optIndex}
                              onChange={(e) =>
                                editQuestion(
                                  questions,
                                  2,
                                  index,
                                  optIndex,
                                  e.target.value
                                )
                              }
                            />
                            <textarea
                              className="form-control"
                              id={`option-${index}-${optIndex}`}
                              placeholder={`Option: ${optIndex}`}
                              name={`option-${index}-${optIndex}`}
                              value={option}
                              onChange={(e) =>
                                editQuestion(
                                  questions,
                                  0,
                                  index,
                                  optIndex,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        );
                      })}
                      <div className="m-4">
                        <button
                          type="button"
                          onClick={() => addQuestion(questions, 0, index)}
                          className="btn btn-outline-primary col-12 text-start">
                          Add Option
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="m-4 col-12">
            <button
              type="button"
              onClick={() => addQuestion(questions, 1, -1)}
              className="btn btn-outline-primary p-3 text-start">
              Add Question
            </button>
            <button
              type="button"
              onClick={() => checkAssignment()}
              className="btn btn-outline-primary p-3 text-start">
              Save Assignment
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAssignment;
