// rrd imports
import { ArrowUturnLeftIcon, HomeIcon } from "@heroicons/react/20/solid";
import { Link, useNavigate, useRouteError } from "react-router-dom";
import { DataItem } from "../api/helpers";

const ErrorPage: React.FC = () => {
  const error = useRouteError() as DataItem;
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <h1>{error.message || error.statusText}</h1>
      <div>
        <button className="btn" onClick={() => navigate(-1)}>
          {/* <ArrowUturnLeftIcon width={20} /> */}
          <span>Go Back</span>
        </button>
        <button className="btn" onClick={() => navigate("/")}>
          {/* <HomeIcon width={20} /> */}
          <span>Go home</span>
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
