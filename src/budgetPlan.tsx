import "./budgetPlan.css";
import { UserContext } from "./entity/userContext";
import { useContext, useState } from "react";
import Navigation2 from "./navigation2";

const BudgetPlans = () => {
  const { state } = useContext(UserContext);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  return (
    <div className="budget-plans-container">
      <Navigation2
        collapsed={isNavCollapsed}
        onToggleCollapse={() => setIsNavCollapsed(!isNavCollapsed)}
      />
      <div
        className={`main-content-dashboard ${
          isNavCollapsed ? "nav-collapsed" : ""
        }`}
        id="main-content-dashboard"
      >
        <header className="header">
          <div className="logo-title">
            <div className="logo" />
            <h1>Budget Plans</h1>
          </div>
          <div className="header-actions">
            <span className="notification-icon" />
            <div className="profile-circle" />
          </div>
        </header>

        <div className="search-create-bar">
          <input
            type="text"
            placeholder="Search Budget Plan Title"
            className="search-input"
          />
          <button className="create-button">+ Create</button>
        </div>

        <div className="filters">
          <label>
            Date Created
            <input type="checkbox" />
          </label>
          <label>
            By Status
            <input type="checkbox" />
          </label>
          <label>
            By Category
            <input type="checkbox" />
          </label>
        </div>

        <h2 className="plans-title">{state.name}'s Plans</h2>

        <div className="plans-grid">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="plan-card" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetPlans;
