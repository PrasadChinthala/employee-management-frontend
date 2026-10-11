
import { useEffect, useState } from "react";
import {
    getAllEmployees,
    createEmployee,
    updateEmployee
} from "./api/employeeService";

const emptyForm = {
    name: "",
    age: "",
    salary: "",
    department: ""
};

function App() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [formData, setFormData] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    const fetchEmployees = () => {
        setLoading(true);

        return getAllEmployees()
            .then((response) => {
                setEmployees(response.data);
                setError("");
            })
            .catch((error) => {
                console.error("Error fetching employees:", error);
                setError("Failed to fetch employees.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    const handleEdit = (employee) => {
        setEditingId(employee.id);

        setFormData({
            name: employee.name,
            age: String(employee.age),
            salary: String(employee.salary),
            department: employee.department
        });

        setError("");
        setSuccess("");
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setError("");
        setSuccess("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const employee = {
            name: formData.name.trim(),
            age: Number(formData.age),
            salary: Number(formData.salary),
            department: formData.department.trim()
        };

        const isEditing = editingId !== null;

        const request = isEditing
            ? updateEmployee(editingId, employee)
            : createEmployee(employee);

        request
            .then(() => {
                setSuccess(
                    isEditing
                        ? "Employee updated successfully!"
                        : "Employee created successfully!"
                );

                setEditingId(null);
                setFormData({ ...emptyForm });

                return fetchEmployees();
            })
            .catch((error) => {
                console.error("Error saving employee:", error);
                setError("Failed to save employee. Please try again.");
            });
    };

    return (
        <div>
            <h1>Employee Management</h1>

            <h2>
                {editingId !== null ? "Edit Employee" : "Add Employee"}
            </h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name: </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Age: </label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        min="1"
                        required
                    />
                </div>

                <div>
                    <label>Salary: </label>
                    <input
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                <div>
                    <label>Department: </label>
                    <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">
                    {editingId !== null ? "Update Employee" : "Add Employee"}
                </button>

                {editingId !== null && (
                    <button
                        type="button"
                        onClick={handleCancelEdit}
                    >
                        Cancel
                    </button>
                )}
            </form>

            {success && <p>{success}</p>}
            {error && <p>{error}</p>}

            <h2>Employee List</h2>

            {loading ? (
                <p>Loading employees...</p>
            ) : employees.length === 0 ? (
                <p>No employees found.</p>
            ) : (
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Salary</th>
                            <th>Department</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee.id}>
                                <td>{employee.id}</td>
                                <td>{employee.name}</td>
                                <td>{employee.age}</td>
                                <td>{employee.salary}</td>
                                <td>{employee.department}</td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(employee)}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default App;