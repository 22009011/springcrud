import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeManagement.css'; // Import the CSS file

const EmployeeManagement = () => {
  // States
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form states
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [currentEmployee, setCurrentEmployee] = useState({
    id: null,
    firstName: '',
    lastName: '',
    emailId: ''
  });

  // API base URL
  const API_URL = '/employees';

  // Fetch all employees
  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL);
      setEmployees(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch employees. Please try again later.');
      console.error('Error fetching employees:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an employee
  const deleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setEmployees(employees.filter(employee => employee.id !== id));
        setError(null);
        alert('Employee deleted successfully!');
      } catch (err) {
        setError('Failed to delete employee. Please try again later.');
        console.error('Error deleting employee:', err);
      }
    }
  };

  // Add a new employee
  const addEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL, currentEmployee);
      setEmployees([...employees, response.data]);
      resetForm();
      setError(null);
      alert('Employee added successfully!');
    } catch (err) {
      setError('Failed to add employee. Please try again later.');
      console.error('Error adding employee:', err);
    }
  };

  // Update an existing employee
  const updateEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/${currentEmployee.id}`, currentEmployee);
      setEmployees(employees.map(emp => 
        emp.id === currentEmployee.id ? response.data : emp
      ));
      resetForm();
      setError(null);
      alert('Employee updated successfully!');
    } catch (err) {
      setError('Failed to update employee. Please try again later.');
      console.error('Error updating employee:', err);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    if (formMode === 'add') {
      addEmployee(e);
    } else {
      updateEmployee(e);
    }
  };

  // Set up edit mode
  const editEmployee = (employee) => {
    setFormMode('edit');
    setCurrentEmployee({
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      emailId: employee.emailId
    });
    window.scrollTo(0, 0); // Scroll to the form
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEmployee({ ...currentEmployee, [name]: value });
  };

  // Reset form
  const resetForm = () => {
    setFormMode('add');
    setCurrentEmployee({
      id: null,
      firstName: '',
      lastName: '',
      emailId: ''
    });
  };

  // Load employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="employee-container">
      <h1>Employee Management System</h1>
      
      {/* Error message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {/* Employee Form */}
      <div className="card">
        <h2>
          {formMode === 'add' ? 'Add New Employee' : 'Edit Employee'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="firstName">
                First Name
              </label>
              <input
                className="form-input"
                id="firstName"
                type="text"
                name="firstName"
                value={currentEmployee.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="lastName">
                Last Name
              </label>
              <input
                className="form-input"
                id="lastName"
                type="text"
                name="lastName"
                value={currentEmployee.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="emailId">
                Email Address
              </label>
              <input
                className="form-input"
                id="emailId"
                type="email"
                name="emailId"
                value={currentEmployee.emailId}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="button-container">
            <button
              className="btn btn-primary"
              type="submit"
            >
              {formMode === 'add' ? 'Add Employee' : 'Update Employee'}
            </button>
            {formMode === 'edit' && (
              <button
                className="btn btn-secondary"
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Employee List */}
      <div className="card">
        <h2>Employee List</h2>
        {isLoading ? (
          <p className="message-center">Loading employees...</p>
        ) : employees.length === 0 ? (
          <p className="message-center">No employees found.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(employee => (
                  <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td>{employee.firstName}</td>
                    <td>{employee.lastName}</td>
                    <td>{employee.emailId}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-warning"
                        onClick={() => editEmployee(employee)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteEmployee(employee.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;