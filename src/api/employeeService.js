
import axiosInstance from "./axiosInstance";

const getAllEmployees = () => {
    return axiosInstance.get("/employees");
};
const createEmployee = (employee) => {
    return axiosInstance.post("/employees", employee);
}
const updateEmployee = (id, employee) => {
    return axiosInstance.put(`employees/${id}`, employee);
}

export { getAllEmployees, createEmployee, updateEmployee };