const AssignmentsGrid = (props: any) => {
  const { isAttemptedTab, filteredAssignment, attemptAssignment } = props;

  return (
    <>
      <div>
        <div className={`justify-content-center row py-4`}>
          <div className={`row parent-div col-12`}>
            {filteredAssignment.map((queObj: any) => {
              if (!isAttemptedTab) {
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
              } else {
                return (
                  <div
                    key={queObj.id}
                    className="card card-height"
                    onClick={() => attemptAssignment(queObj)}>
                    <div className="card-body text-start">
                      <div>
                        <label className="col-3">{queObj.assignment_title}</label>
                        <label className="col-1">{queObj.marks}</label>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignmentsGrid;
