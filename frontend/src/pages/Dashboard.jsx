
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Building2,
  UserPlus,
  ArrowUpRight,
  BriefcaseBusiness,
  ArrowRight,
} from "lucide-react";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("employees/")
      .then((response) => setEmployees(response.data))
      .catch(() => setError("Unable to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  const departments = [
    ...new Set(
      employees
        .map((employee) => employee.department.trim())
        .filter(Boolean)
    ),
  ];

  const departmentCounts = departments
    .map((department) => ({
      name: department,
      count: employees.filter(
        (employee) => employee.department.trim() === department
      ).length,
    }))
    .sort((a, b) => b.count - a.count);

  const recentEmployees = [...employees]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  return (
    <div className="dashboard-page">
      <div className="page-heading dashboard-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Dashboard</h1>
          <p>Here's what's happening with your workforce.</p>
        </div>

        <Link to="/add-employee" className="primary-button">
          <UserPlus size={17} />
          Add employee
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="surface loading-state">Loading dashboard...</div>
      ) : (
        <>
          <div className="stats-grid">
            <article className="stat-card">
              <div className="stat-top">
                <span>Total employees</span>
                <span className="stat-icon green-icon">
                  <Users size={19} />
                </span>
              </div>
              <div className="stat-number">{employees.length}</div>
              <div className="stat-bottom">
                <span>Registered in the system</span>
                <Users size={15} />
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>Departments</span>
                <span className="stat-icon blue-icon">
                  <Building2 size={19} />
                </span>
              </div>
              <div className="stat-number">{departments.length}</div>
              <div className="stat-bottom">
                <span>Distinct departments</span>
                <Building2 size={15} />
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>Designations</span>
                <span className="stat-icon amber-icon">
                  <BriefcaseBusiness size={19} />
                </span>
              </div>
              <div className="stat-number">
                {new Set(
                  employees
                    .map((employee) => employee.designation.trim())
                    .filter(Boolean)
                ).size}
              </div>
              <div className="stat-bottom">
                <span>Distinct job titles</span>
                <BriefcaseBusiness size={15} />
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>Latest employee ID</span>
                <span className="stat-icon purple-icon">
                  <UserPlus size={19} />
                </span>
              </div>
              <div className="stat-number">
                {employees.length
                  ? `#${Math.max(...employees.map((employee) => employee.id))}`
                  : "—"}
              </div>
              <div className="stat-bottom">
                <span>Highest current ID</span>
                <ArrowUpRight size={15} />
              </div>
            </article>
          </div>

          <div className="dashboard-content-grid">
            <section className="surface dashboard-panel">
              <div className="panel-heading">
                <div>
                  <h2>Recent employees</h2>
                  <p>Latest records in your directory</p>
                </div>

                <Link to="/employees" className="text-link">
                  View all <ArrowRight size={15} />
                </Link>
              </div>

              {recentEmployees.length === 0 ? (
                <div className="empty-state">
                  <Users size={28} />
                  <p>No employees added yet.</p>
                  <Link to="/add-employee" className="text-link">
                    Add your first employee
                  </Link>
                </div>
              ) : (
                <div className="recent-list">
                  {recentEmployees.map((employee) => (
                    <div className="recent-employee" key={employee.id}>
                      <div className="employee-avatar">
                        {employee.name.trim().charAt(0).toUpperCase()}
                      </div>

                      <div className="recent-employee-info">
                        <strong>{employee.name}</strong>
                        <span>{employee.email}</span>
                      </div>

                      <div className="recent-employee-role">
                        <strong>{employee.designation}</strong>
                        <span>{employee.department}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="surface dashboard-panel">
              <div className="panel-heading">
                <div>
                  <h2>Departments</h2>
                  <p>Employee distribution</p>
                </div>
              </div>

              {departmentCounts.length === 0 ? (
                <div className="empty-state">
                  <Building2 size={28} />
                  <p>Department information will appear here.</p>
                </div>
              ) : (
                <div className="department-list">
                  {departmentCounts.map((department) => (
                    <div
                      className="department-item"
                      key={department.name}
                    >
                      <div className="department-info">
                        <span>{department.name}</span>
                        <strong>{department.count}</strong>
                      </div>

                      <div
                        className="department-track"
                        role="progressbar"
                        aria-label={`${department.name} employee count`}
                        aria-valuemin={0}
                        aria-valuemax={employees.length}
                        aria-valuenow={department.count}
                      >
                        <div
                          className="department-fill"
                          style={{
                            width: `${
                              (department.count / employees.length) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Link to="/employees" className="department-footer">
                Explore employee directory
                <ArrowRight size={15} />
              </Link>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
