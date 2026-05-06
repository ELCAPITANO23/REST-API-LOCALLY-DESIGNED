# Intern Management System

## Overview

This project is a full-stack Intern Management System that allows users to View, search, add, update, and delete intern records through a clean web interface connected to a local API.

It is built using:
Frontend:HTML, CSS, JavaScript
Backend:Node.js with Express
Data Storage:JSON-based (local file)

## Features
Search Interns.
Add Intern
Update Intern.
Delete Intern
View All Interns
* Displays all interns in a structured table.
  
## 🧱 Project Structure
project-root/
│
├── server.js          # Express API
├── interns.json       # Data storage
│
├── public/
│   ├── index.html     # Main UI
│   ├── styles.css     # Styling
│   └── web.js         # Frontend logic

## 🔌 API Endpoints

| Method | Endpoint             | Description      |
| ------ | -------------------- | ---------------- |
| GET    | `/interns`           | Get all interns  |
| GET    | `/interns/:id`       | Get intern by ID |
| GET    | `/interns/search?q=` | Search interns   |
| POST   | `/interns`           | Add new intern   |
| PUT    | `/interns/:id`       | Update intern    |
| DELETE | `/interns/:id`       | Delete intern    |

## License: This project is for educational purposes.
