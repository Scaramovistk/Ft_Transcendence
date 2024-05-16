# ft_transcendence
It is a group project with the aim of developing a website accessible via HTTPS that hosts the classic game PONG.

## About ft_transcendence?
The BackEnd must be built using Python(Django), the FrontEnd made with HTML, CSS(Bootstrap toolkit) and JavaScript and the database must be [PostgreSQL.](https://www.postgresql.org/)

There are no restraints in regards to external libraries and the website but it needs to be a [single-page application.](https://en.wikipedia.org/wiki/Single-page_application) It should be compatible with [Google Chrome](https://www.google.com/intl/en-US/chrome/).

The user must log in using after doing the registration in the system and be able to use a [two-factor authentication](https://authy.com/what-is-2fa/) method, for which we chose the [Google Authenticator App.](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en_US&gl=US)

Overall, the platform should have a ranking system, profile editing, AI opponent, tournament system ,view users status, friend features and some profile customization options.

The main purpose is to play an implementation of [Pong](https://en.wikipedia.org/wiki/Pong), as if it was [1972.](https://www.youtube.com/watch?v=fiShX2pTz9A) all over again

Finally, the server structure must be containerized using [docker](https://www.docker.com/) and available with a single call of: **docker-compose up --build**.

In this project we need to choose 7 major modules (2 minor module = 1 major), the picked ones where the following:

### Web
  Major module: Use a Framework as backend.
  Minor module: Use a front-end framework or toolkit.
  Minor module: Use a database for the backend.
### User Management
  Major module: Standard user management, authentication, users across tournaments.
### Gameplay and user experience
  Major module: Remote players
### IA-Algo
  Major module: Introduce an AI Opponent.
### Cybersecurity
  Major module: Implement Two-Factor Authentication (2FA) and JWT.
### Devops
  Major module: Designing the Backend as Microservices.

## Getting started (Staging)
**Follow the steps below**
```bash
# Clone the project and access the folder
git clone https://github.com/Scaramovistk/Ft_Transcendence.git && cd Ft_Transcendence/

# create a .env file in your root
# examples are given in .env.example in each folder

# Run make to install the packages and create the Docker containers (this may take a while)
make

# Run make up so you can build the images
# and run the containers
make up

# Access the login page using the URL below
# Create a account
https://localhost:$FRONTEND_PORT

# Run make down to stop running containers
make down

# Alert!
# This will clean up all your docker related files and containers
# Use this if you really want to clean your machine
make fclean

# Well done!
```
---

Made by:
Gabriel Scaramal 👋 [See my github](https://github.com/Scaramovistk)<br/>
Yannick Jorus 👋 [See my github](https://github.com/Yjorus)<br/>
Sandra Munyanshoza 👋 [See my linkedin](https://github.com/samunyan)<br/>
