// rrd imports
import { Form, Link, Outlet, useLocation } from "react-router-dom";

// library imports
import { FaChartPie, FaPhone } from "react-icons/fa";
import { FaHouse, FaMoneyBillTransfer } from "react-icons/fa6";
import { deleteAllData, generateDummyData } from "../utils/services";

const Layout: React.FC = () => {
  const location = useLocation();
  const addDevButtons = false;

  return (
    <div className="layout">
      <div className="navbar">
        <nav>
          <div className="menu">
            <Link
              to="/"
              className={`menu-item ${
                location.pathname === "/" ? "active" : ""
              }`}
            >
              <FaHouse className="icon" />
              <span>Home</span>
            </Link>
            <Link
              to="/transactions"
              className={`menu-item ${
                location.pathname === "/transactions" ? "active" : ""
              }`}
            >
              <FaMoneyBillTransfer className="icon" />
              <span>Transactions</span>
            </Link>
            <Link
              to="/spending-analysis"
              className={`menu-item ${
                location.pathname === "/spending-analysis" ? "active" : ""
              }`}
            >
              <FaChartPie className="icon" />
              <span>Charts</span>
            </Link>
            <Link
              to="/contact"
              className={`menu-item ${
                location.pathname === "/contact" ? "active" : ""
              }`}
            >
              <FaPhone className="icon" />
              <span>Contact</span>
            </Link>
          </div>
          {addDevButtons && (
            <div>
              <Form method="post" onSubmit={() => generateDummyData()}>
                <button className="btn btn-rect">Set Dummy Data</button>
              </Form>
              <Form method="post" onSubmit={() => deleteAllData()}>
                <button className="btn btn-rect">Delete All Data</button>
              </Form>
            </div>
          )}
        </nav>
      </div>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
