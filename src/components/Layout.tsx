// rrd imports
import { Link, Outlet } from "react-router-dom";
import { deleteUserData } from "../api/helpers";

const Layout: React.FC = () => {
  return (
    <div className="layout">
      <aside className="sidebar">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/transactions">Transactions</Link>
            </li>
            <li>
              <Link to="/spending-analysis">Spending Analysis</Link>
            </li>
            <li>
              <Link to="/budget-goals">Budget Goals</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
            <li>
              <Link to="/support">Support</Link>
            </li>
          </ul>
        </nav>

        <button
          className="btn"
          onClick={() => {
            if (!confirm("Are you sure you want to delete all data?")) {
              return;
            }
            deleteUserData();
          }}
        >
          Delete Everything!
        </button>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
