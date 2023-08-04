import { useContext, useEffect, useState } from "react";
import ToastContext from "../toastContext";
import { attemptAssignment, submitAssignment } from "../services/commonServies";
import { useLocation, useNavigate } from "react-router-dom";

enum ToastType {
  SUCCESS = "Successfuly Done",
  ERROR = "Error",
  EMPTYVALUE = "Empty",
  NOTHING = "",
}

const AttemptAssignment = () => {

  const location = useLocation();
  const assignmentId = location.state;
  
  let navigate = useNavigate();
  
  const { setDataFromChild } = useContext(ToastContext);
  const showToast = (message: Toast) => {
    setDataFromChild(message, 3);
  };

  const [questions, questionChange] = useState([
    { question: "", options: [""], answer: -1 },
  ]);
  const [submissionArray, setSubsArray] = useState<any>([]);
  const [assignmentDetails, setDetails] = useState<any>({});

  useEffect(() => {
    getAssignment();
  }, []);

  const getAssignment = async () => {
    try {
      let data = await attemptAssignment(assignmentId);
      data = data.data;
      let tempQuestions: any = [];
      let ansLen = data.answers.length;
      setDetails({
        title: data.title,
        createdAt: data.createdAt,
        classId: data.classId,
        subject: data.subject
      })
      const emptyArray: any = new Array(ansLen).fill(-1);
      setSubsArray(emptyArray);
      for (let i = 0; i < ansLen; i++) {
        let tempQuestion = {
          question: data.questions[i].question,
          options: data.questions[i].options,
          answer: data.answers[i],
        };
        tempQuestions.push(tempQuestion);
      }
      questionChange(tempQuestions);
    } catch (error) { }
  };

  const checkOption = (index: number, optIndex: number) => {
    debugger;
    let temp = [...submissionArray];
    if (submissionArray[index] < 0) {
      temp[index] = optIndex;
    } else if (submissionArray[index] == optIndex) {
      temp[index] = -1;
    } else {
      temp[index] = optIndex;
    }
    setSubsArray(temp);
  };

  const saveAssignment = () => {
    submitAssignment(submissionArray, assignmentId).then(
      (res) => {
        if (res.status == 200) {
          showToast({
            details: res.message,
            showToast: true,
            title: "SUBMIT",
            type: ToastType.SUCCESS,
          });
          navigate('/student-dashboard');
        } else {
          showToast({
            details: res.message,
            showToast: true,
            title: "ERROR",
            type: ToastType.ERROR,
          });
        }
      },
      (err) => {
        showToast({
          details: err.message,
          showToast: true,
          title: "ERROR",
          type: ToastType.ERROR,
        });
      }
    );
    try {
    } catch (error) { }
  };

  const checkAssignment = () => {
    debugger;
    for (let index = 0; index < questions.length; index++) {
      const question = questions[index];
      for (let opt = 0; opt < question.options.length; opt++) {
        if (!question.options[opt]) {
          showToast({
            details: `Some questions are still unattempted, like question number ${index + 1
              }. Still wanna SUBMIT?`,
            showToast: true,
            title: "Missing Answer",
            type: ToastType.EMPTYVALUE,
          });
          return;
        } else {
        }
      }
    }
    saveAssignment();
  };

  return (
    <>
      <div className="container">
        <div>
          <div className="col-12 m-4">
            <h3 className="form-label">{assignmentDetails.title}</h3>
            <p className="form-label">Subject: {assignmentDetails.subject}</p>
            <p className="form-label">Class: {assignmentDetails.classId}</p>
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
                  </h2>
                  <div
                    id={"collapse" + index}
                    className="accordion-collapse collapse show">
                    <div className="accordion-body pb-0">
                      <div
                        className="form-control my-2"
                        id={`question-${index}`}>
                        <strong>{`Question ${index + 1}. `}</strong>
                        {queObj.question}
                      </div>
                      {queObj.options.map((option, optIndex) => {
                        return (
                          <div key={`${index}-${optIndex}`}>
                            <div
                              className="form-control mb-1"
                              id={`option-${index}-${optIndex}`}
                              style={{
                                border: `1px solid ${submissionArray[index] === optIndex
                                  ? "blue"
                                  : "lightgrey"
                                  }`,
                              }}
                              onClick={() => checkOption(index, optIndex)}>
                              <strong>{`Option ${optIndex + 1}.  `}</strong>
                              {option}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="m-4 col-12">
            <button
              type="button"
              onClick={() => checkAssignment()}
              className="btn btn-outline-primary p-3 text-start">
              Submit Assignment
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AttemptAssignment;
