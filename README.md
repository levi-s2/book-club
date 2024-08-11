# Online Book-Club Platform

## Overview:

Welcome to the Book-Club application! The app was made for people who enjoy reading books and want to interact with other with the same passion for reading. Here, you can join as many clubs as you want and talk about your favorite books with the members. Make your own personalized profile to show your book list and clubs. Add friends you meet in the communities and more!

## Features

- User Authentication: Secure registration and login with JWT-based authentication.
- Clubs: Create and manage book clubs, update current reading,genres and remove members.
- Books: Add books to personal collections, rate them, and display your collection.
- Friends: Add and remove friends, view friends’ profiles and their book clubs.
- User Profile: Update personal information, view created and joined clubs.
- Responsive Design: Context and State management for a smooth navigation and data fetching.


## Technologies Used
- Frontend: React, React Router, Axios
- Backend: Flask, Flask-RESTful, Flask-JWT-Extended, Flask-SQLAlchemy, Flask-Migrate
- Database: SQLite (development), PostgreSQL (production)
- Authentication: JSON Web Tokens (JWT)
- Styling: CSS, Ant Design


# Library Manager

### [Youtube]
https://youtu.be/_FLw_J9lM6A


# Deployed Version
- backend: 
https://book-club-api-1hda.onrender.com

-frontend: 
https://book-club-platform.onrender.com

## Getting Started

> **Note:** The `$` symbol indicates a command that should be run in your terminal. Do not include it when running commands.

### Prerequisites

- Python 3.8 or higher
- pipenv
- Node.js and npm
- Flask and SQLAlchemy

### Installation

1. Clone the repository

2. Navigate to the project directory and to the /server folder

3. Install dependencies using pipenv
    ```s
    $ pipenv install
    ```

4. Activate the virtual environment
    ```s
    $ pipenv shell
    ```

5.  Set up the database
    ```s
    $ flask db init
    $ flask db migrate -m "Initial migration."
    $ flask db upgrade
    ```

6. Run the backend server:
    ```s
    $ gunicorn app:app
    ```

6. Navigate to the /client folder
    ```s
    $ cd ../client
    ```

7. Install dependencies
    ```s
    $ npm install
    ```

8. Run the frontend development server
    ```s
    $ npm start
Remember to change the base_url in the axiosConfig.js located in the /client/src/components to: 
http://localhost:5000, as that is the proper url for using if you´re going to be running the backend
locally as well. Feel free to use the deployed url, but keep in mind requests will be delayed, since it´s a free tier version.

9. Mock Data(optional)
if you want to view the application with mock data run the seed file in the server directory

    ```s
    $ cd server %% python seed.py


### Inside the App

- Register: Create a new account using the registration page.
- Login: Access your account using the login page.
- Create a Club: Navigate to the 'Create Club' section and fill in the details.
- Add Books: Search for books and add them to your collection.
- Manage Clubs: Update current reading, manage genres, and remove members.
- Add Friends: Visit other user profiles to add them as friends.
- Update Profile: Update your personal information through the profile page.



        



