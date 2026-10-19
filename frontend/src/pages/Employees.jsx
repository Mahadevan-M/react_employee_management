
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  UserPlus,
  Pencil,
  Trash2,
  Users,
  X,
} from "lucide-react";
import api from "../services/api";
import "./Employees.css";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [deletingId, setDeletingId] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    api
      .get("employees/")
      .then((response) => setEmployees(response.data))
      .catch(() => setError("Unable to load employees. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const departments = useMemo(
    () => [
      ...new Set(
        employees
          .map((employee) => employee.department.trim())
          .filter(Boolean)
      ),
    ].sort(),
    [employees]
  );

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch = [
        employee.name,
        employee.email,
        employee.department,
        employee.designation,
      ].some((value) => value.toLowerCase().includes(query));

      const matchesDepartment =
        department === "all" || employee.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [employees, search, department]);

  async function handleDelete() {
    if (!employeeToDelete) return;

    const employee = employeeToDelete;
    setDeletingId(employee.id);
    setError("");

    try {
      await api.delete(`employees/${employee.id}/`);

      setEmployees((previous) =>
        previous.filter((item) => item.id !== employee.id)
      );
      setEmployeeToDelete(null);
    } catch {
      setError("Unable to delete employee. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="employees-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">PEOPLE MANAGEMENT</p>
          <h1>Employees</h1>
          <p>Manage your employee directory and information.</p>
        </div>

        <Link to="/add-employee" className="primary-button">
          <UserPlus size={17} />
          Add employee
        </Link>
      </div>

      <div className="employee-summary">
        <div className="summary-icon">
          <Users size={20} />
        </div>
        <div>
          <strong>{employees.length}</strong>
          <span>Total employees</span>
        </div>
        <div className="summary-divider" />
        <div>
          <strong>{filteredEmployees.length}</strong>
          <span>Records displayed</span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <section className="surface employee-directory">
        <div className="directory-toolbar">
          <div className="directory-title">
            <h2>All employees</h2>
            <p>Search and manage employee records</p>
          </div>

          <div className="directory-filters">
            <label className="search-box">
              <Search size={17} />
              <input
                type="search"
                placeholder="Search employees..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search employees"
              />
              {search && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </label>

            <select
              className="department-select"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              aria-label="Filter by department"
            >
              <option value="all">All departments</option>
              {departments.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading employees...</div>
        ) : filteredEmployees.length === 0 ? (
          <div className="empty-state">
            <Users size={30} />
            <p>
              {employees.length === 0
                ? "No employees have been added yet."
                : "No employees match your search."}
            </p>
            {employees.length === 0 ? (
              <Link to="/add-employee" className="text-link">
                Add your first employee
              </Link>
            ) : (
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setSearch("");
                  setDepartment("all");
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="employee-table-wrapper">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>DEPARTMENT</th>
                  <th>DESIGNATION</th>
                  <th>PHONE</th>
                  <th className="actions-heading">ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div className="table-employee">
                        <div className="employee-avatar">
                          {employee.name.trim().charAt(0).toUpperCase()}
                        </div>
                        <div className="table-employee-info">
                          <strong>{employee.name}</strong>
                          <span>{employee.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="department-badge">
                        {employee.department}
                      </span>
                    </td>

                    <td className="designation-cell">
                      {employee.designation}
                    </td>

                    <td className="phone-cell">
                      {employee.phone || "—"}
                    </td>

                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/edit-employee/${employee.id}`}
                          className="icon-action edit-action"
                          aria-label={`Edit ${employee.name}`}
                          title="Edit employee"
                        >
                          <Pencil size={15} />
                        </Link>

                        <button
                          type="button"
                          className="icon-action delete-action"
                          aria-label={`Delete ${employee.name}`}
                          title="Delete employee"
                          disabled={deletingId === employee.id}
                          onClick={() => setEmployeeToDelete(employee)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredEmployees.length > 0 && (
          <div className="directory-footer">
            Showing {filteredEmployees.length} of {employees.length} employees
          </div>
        )}
      </section>

      {employeeToDelete && (
        <div
          className="modal-backdrop"
          onClick={() => {
            if (!deletingId) setEmployeeToDelete(null);
          }}
        >
          <section
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="confirm-icon">
              <Trash2 size={22} />
            </div>

            <h2 id="delete-title">Delete employee?</h2>
            <p>
              Are you sure you want to delete{" "}
              <strong>{employeeToDelete.name}</strong>? This action cannot
              be undone.
            </p>

            <div className="confirm-actions">
              <button
                type="button"
                className="secondary-button"
                disabled={deletingId !== null}
                onClick={() => setEmployeeToDelete(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="danger-button"
                disabled={deletingId !== null}
                onClick={handleDelete}
              >
                {deletingId !== null ? "Deleting..." : "Delete employee"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default Employees;
