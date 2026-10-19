
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`employees/${id}/`)
      .then((response) => {
        const employee = response.data;

        setFormData({
          name: employee.name,
          email: employee.email,
          department: employee.department,
          designation: employee.designation,
          phone: employee.phone || "",
        });
      })
      .catch(() => {
        setError("Unable to load employee details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.put(`employees/${id}/`, formData);
      navigate("/employees");
    } catch (err) {
      const data = err.response?.data;

      setError(
        data
          ? Object.entries(data)
              .map(([field, message]) =>
                `${field}: ${
                  Array.isArray(message)
                    ? message.join(", ")
                    : String(message)
                }`
              )
              .join(" | ")
          : "Unable to connect to the server."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading employee...</p>;

  return (
    <div>
      <h1>Edit Employee</h1>

      {error && <p role="alert">{error}</p>}

      <form onSubmit={handleSubmit}>
        {[
          ["name", "Full Name"],
          ["email", "Email"],
          ["department", "Department"],
          ["designation", "Designation"],
          ["phone", "Phone"],
        ].map(([name, label]) => (
          <div key={name}>
            <label htmlFor={name}>{label}</label>
            <input
              id={name}
              name={name}
              type={name === "email" ? "email" : "text"}
              value={formData[name]}
              onChange={handleChange}
              required={name !== "phone"}
            />
          </div>
        ))}

        <button type="submit" disabled={saving}>
          {saving ? "Updating..." : "Update Employee"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/employees")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditEmployee;
