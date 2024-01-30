
# Student Attendance System

Welcome to the Student Attendance System project! This system provides a comprehensive solution for managing student attendance using a stack that includes React for the frontend, Node.js (Express) for the backend, and MongoDB for the database.

## Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Docker Images](#docker-images)
- [Running the Project](#running-the-project)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Student Attendance System is designed to streamline the process of tracking and managing student attendance. It includes a backend API built with Node.js and Express, a user-friendly React frontend, a QR panel for generating and scanning QR codes, and a mobile app for students to mark their attendance.

## Project Structure

### The project is organized as follows: 

- backend/  (Backend service)
- frontend/ (Admin Panel service)
- qrpanel/ (QR Panel service)
- mobileapp/ (Mobile App Service)
- docker-compose.yml (Docker Compose configuration)
- dockerignore (Docker ignore file)


## Docker Images

### Backend Docker Image:
[Docker Hub - Student Attendance System Backend](https://hub.docker.com/repository/docker/parshu8203/student-attendance-system-backend)

```bash
docker pull parshu8203/student-attendance-system-backend:latest
docker run -p 5000:5000 parshu8203/student-attendance-system-backend:latest
```
### Fronend Docker Image:
[Docker Hub - Student Attendance System Frontend](https://hub.docker.com/repository/docker/parshu8203/student-attendance-system-frontend)

```bash
docker pull parshu8203/student-attendance-system-frontend:latest
docker run -p 3000:3000 parshu8203/student-attendance-system-frontend:latest
```
### QRPanel Docker Image:
[Docker Hub - Student Attendance System QRPanel](https://hub.docker.com/repository/docker/parshu8203/student-attendance-system-qrpanel)
```bash
docker pull parshu8203/student-attendance-system-qrpanel:latest
docker run -p 3001:3001 parshu8203/student-attendance-system-qrpanel:latest
```
### MobileApp Docker Image:
[Docker Hub - Student Attendance System MobileApp](https://hub.docker.com/repository/docker/parshu8203/student-attendance-system-qrpanel)
```bash
Copy code
docker pull parshu8203/student-attendance-system-mobileapp:latest
docker run -p 8081:8081 parshu8203/student-attendance-system-mobileapp:latest
```
## Running the Project
Clone the git repository, set up the .env file in the backend, and run the following commands:

### For Backend
```bash
cd backend
npm install
nodemon index.js
```
### For Frontend
```bash
cd frontend
npm install
npm start
```
### For QRPanel
```bash
cd qrpanel
npm install
npm start
```
### For MobileApp
```bash
cd mobileapp
npm install
npm start
```

## Tech Stack
- Frontend: React(Web), React Native(Mobile Application)
- Backend: Node.js (Express)
- Database: MongoDB



