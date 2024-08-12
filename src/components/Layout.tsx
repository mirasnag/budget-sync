// rrd imports
import { Link, Outlet, useLocation } from "react-router-dom";

// library imports
import { FaBullseye, FaChartPie, FaCog, FaPhone } from "react-icons/fa";
import { FaArrowsRotate, FaHouse } from "react-icons/fa6";

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="layout">
      <aside className="sidebar">
        <nav>
          <div className="menu">
            <Link
              to="/"
              className={`menu-item ${
                location.pathname === "/" ? "active" : ""
              }`}
            >
              <FaHouse className="icon" /> Home
            </Link>
            <Link
              to="/transactions"
              className={`menu-item ${
                location.pathname === "/transactions" ? "active" : ""
              }`}
            >
              <FaArrowsRotate className="icon" /> Transactions
            </Link>
            <Link
              to="/spending-analysis"
              className={`menu-item ${
                location.pathname === "/spending-analysis" ? "active" : ""
              }`}
            >
              <FaChartPie className="icon" /> Spending Analysis
            </Link>
            <Link
              to="/budget-goals"
              className={`menu-item ${
                location.pathname === "/budget-goals" ? "active" : ""
              }`}
            >
              <FaBullseye className="icon" /> Budget Goals
            </Link>
            <Link
              to="/settings"
              className={`menu-item ${
                location.pathname === "/settings" ? "active" : ""
              }`}
            >
              <FaCog className="icon" /> Settings
            </Link>
            <Link
              to="/support"
              className={`menu-item ${
                location.pathname === "/support" ? "active" : ""
              }`}
            >
              <FaPhone className="icon" /> Support
            </Link>
          </div>
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
