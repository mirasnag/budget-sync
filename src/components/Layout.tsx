// rrd imports
import { Link, Outlet, useLocation } from "react-router-dom";

// library imports
import { FaChartPie, FaPhone } from "react-icons/fa";
import { FaHouse, FaMoneyBillTransfer } from "react-icons/fa6";

const Layout: React.FC = () => {
  const location = useLocation();

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
            {/* <Link
              to="/contact"
              className={`menu-item ${
                location.pathname === "/contact" ? "active" : ""
              }`}
            >
              <FaPhone className="icon" />
              <span>Contact</span>
            </Link> */}
          </div>
        </nav>
      </div>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
