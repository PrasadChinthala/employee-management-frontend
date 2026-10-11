
import { useEffect, useState } from "react";
import {
    getAllEmployees,
    createEmployee
} from "./api/employeeService";

function App() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        salary: "",
        department: ""
    });

    const fetchEmployees = () => {
        setLoading(true);

        getAllEmployees()
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

        createEmployee(employee)
            .then(() => {
                setSuccess("Employee created successfully!");

                setFormData({
                    name: "",
                    age: "",
                    salary: "",
                    department: ""
                });

                fetchEmployees();
            })
            .catch((error) => {
                console.error("Error creating employee:", error);
                setError("Failed to create employee. Please check your input and try again.");
            });
    };

    return (
        <div>
            <h1>Employee Management</h1>

            <h2>Add Employee</h2>

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

                <button type="submit">Add Employee</button>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default App;