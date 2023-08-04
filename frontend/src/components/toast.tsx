const Toast = (props: Toast) => {
  return (
    <div>
      {props?.showToast && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3 toast-class">
          <div
            id="liveToast"
            role="alert"
            aria-live="assertive"
            aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">{props.title}</strong>
              <small className="m-2">{props.type}</small>
            </div>
            <div className="toast-body m-2" style={{maxWidth: '25rem'}}>{props.details}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toast;
