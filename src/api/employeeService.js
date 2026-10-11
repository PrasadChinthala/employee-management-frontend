
import axiosInstance from "./axiosInstance";

const getAllEmployees = () => {
    return axiosInstance.get("/employees");
};
const createEmployee = (employee) => {
    return axiosInstance.post("/employees", employee);
}

export { getAllEmployees, createEmployee };