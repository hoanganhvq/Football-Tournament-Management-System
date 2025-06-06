# Football Tournament Management System

A football tournament management system with models for Match, Player, Team, Tournament, and User. This project helps manage and organize football tournaments, including teams, matches, and players.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
  - [Requirements](#requirements)
  - [Backend Installation](#backend-installation)
  - [Frontend Installation](#frontend-installation)
- [Project Structure](#project-structure)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This system allows users to organize and manage football tournaments, including team registration, match scheduling, and result tracking. Key features of the project include:

- Player management
- Team management
- Match scheduling and tracking
- Results and ranking management
- State about tournament and team

## Installation

### Clone the repository:
    
    git clone https://github.com/hoanganhvq/Football-Tournament-Management-System.git


### Requirements

- Node.js (version 14.x or higher)
- MongoDB 
- Git 

### Backend Installation

1. Install backend dependencies:
    ```bash
    cd backend
    npm install
    ```

2. Configure environment variables (`.env`):  
    Create a `.env` file in the `backend` folder and add the necessary environment variables like:
    ```env
    MONGO_URI =mongodb://localhost:27017/football_tournament
    JWT_SECRET=your_jwt_secret_key
    CLOUDINARY_CLOUD_NAME =your_cloudinary_name
    CLOUDINARY_API_KEY = your_cloudinary_api_key
    CLOUDINARY_API_SECRET = your_cloudinary_api_secret
    ```

3. Start the application:
    ```bash
    npm start
    ```

### Frontend Installation

1. Install frontend dependencies:
    ```bash
    cd frontend
    npm install
    ```

3. Start the application:
    ```bash
    npm start
    ```

## Project Structure

### Backend

- **/models**: Contains data models (MongoDB models).
- **/routes**: Contains API routes.
- **/controllers**: Contains the business logic.
- **/middleware**: Middleware for authentication and access control.
- **/config**: Configuration for database connection, authentication, etc.
- **/uploads**: Folder to save temporary images.

### Frontend

- **/src**: Contains the source code for the React application.
- **/components**: UI components.
- **/pages**: Pages of the application (e.g., home, registration, login).
- **/api**: Services for making API calls to the backend.

## Usage

1. **Create a User Account**: Register and log in to the system to manage tournaments, teams, and players.
2. **Create a Tournament**: User can create a new tournament, add teams, and schedule matches.
3. **Join a Tournament**: Teams can participate in tournaments and track match results.

## Technologies Used

### Backend:
- Node.js
- Express.js
- MongoDB (or another database)
- JWT (JSON Web Token) for authentication
- Cloudinary for image uploads

### Frontend:
- React.js
- Axios for API requests
- React Router for navigation

### DevOps:
- Docker (if applicable)

## License

This project is licensed under the MIT License.
