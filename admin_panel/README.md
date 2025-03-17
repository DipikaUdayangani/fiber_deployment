# README.md content

# Fiber Development Workflow Management System

## Overview
This project is a workflow management system designed for Fiber Development, built using Django and MySQL. It includes user management for workgroups and task assignments.

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd fiber-workflow
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install the required packages:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure the database:**
   Update the `DATABASES` setting in `workflow/settings.py` to connect to your MySQL database.

5. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Create a superuser:**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

## Usage
Access the application at `http://127.0.0.1:8000/`. Use the admin panel to manage users, workgroups, and tasks.

## License
This project is licensed under the MIT License.