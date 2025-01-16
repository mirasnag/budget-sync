// rrd imports
import { useNavigate, useRouteError } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const error = useRouteError() as any;
  const navigate = useNavigate();
  console.log(error.message || error.statusText);
  return (
    <div className="error-page">
      <h1>{"Something went wrong!"}</h1>
      <div>
        <button className="btn btn-medium" onClick={() => navigate(-1)}>
          <span>Go Back</span>
        </button>
        <button className="btn btn-medium" onClick={() => navigate("/")}>
          <span>Go home</span>
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
