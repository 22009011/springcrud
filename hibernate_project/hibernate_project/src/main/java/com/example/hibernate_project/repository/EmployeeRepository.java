package com.example.hibernate_project.repository;


import com.example.hibernate_project.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface  EmployeeRepository extends JpaRepository<Employee, Long> {
    // all crud database methods
}