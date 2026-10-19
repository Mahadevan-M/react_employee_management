
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddEmployee() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      await api.post("employees/", formData);
      navigate("/employees");
    } catch (err) {
      const data = err.response?.data;

      if (data && typeof data === "object") {
        const messages = Object.entries(data)
          .map(([field, message]) => {
            const detail = Array.isArray(message)
              ? message.join(", ")
              : String(message);

            return `${field}: ${detail}`;
          })
          .join(" | ");

        setError(messages || "Unable to save employee.");
      } else {
        setError("Unable to connect to the server. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1>Add Employee</h1>

      {error && <p role="alert">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="department">Department</label>
          <input
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="designation">Designation</label>
          <input
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Employee"}
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

export default AddEmployee;
