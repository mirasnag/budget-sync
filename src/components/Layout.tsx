// rrd imports
import { Link, Outlet, useLocation } from "react-router-dom";

// library imports
import { FaChartPie, FaPhone } from "react-icons/fa";
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
              to="/contact"
              className={`menu-item ${
                location.pathname === "/contact" ? "active" : ""
              }`}
            >
              <FaPhone className="icon" /> Contact
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
