# TMS - Translation Management System

TMS (Translation Management System) is a web-based platform that enables users to manage translations for their applications. It provides a user-friendly interface for translating content, managing translation memories, and collaborating with developers and product owners. The system supports multiple languages and offers robust backend and frontend architectures, containerized deployment, and monitoring integrations.

---

## Features

- **User Authentication & Roles**: Secure sign-in/sign-up with role-based access (Admin, Product Owner, Developer).
- **App Management**: Create, update, and delete projects (Apps) for which translations are managed.
- **Translation Management**: Add, update, validate, publish, and delete translations for each app, supporting multiple languages (English, French, Arabic).
- **Developer Management**: Manage developer accounts, activate/deactivate access.
- **API Access**: Each app provides an API endpoint and secret key for programmatic access to translations.
- **Internationalization**: Full i18n support using i18next, with language switching in the UI.
- **Monitoring & Logging**: Integrated with Prometheus and ELK stack for metrics and logging.
- **Modern UI**: Built with React and Chakra UI, providing a responsive and attractive interface.
- **Dockerized Deployment**: Easily deployable using Docker Compose, with separate services for frontend, backend, and MongoDB.

---

## Architecture

- **Frontend**: React 18, Chakra UI, i18next, Axios, React Router, and more. Located in `/frontend`.
- **Backend**: Node.js, Express, MongoDB (via Mongoose), JWT authentication, Prometheus metrics, and i18next middleware. Located in `/backend`.
- **Database**: MongoDB, containerized for easy setup.
- **Monitoring**: Prometheus for metrics, ELK stack for logging (see `/elk_stack`).
- **Containerization**: All services are containerized using Docker Compose.

---

## Getting Started

### Prerequisites

- [Node.js (LTS)](https://nodejs.org/en/)
- [Docker & Docker Compose](https://docs.docker.com/get-docker/)

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd TMS
   ```

2. **Start all services using Docker Compose:**
   ```bash
   docker-compose up --build
   ```
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)
   - MongoDB: [localhost:27017](mongodb://admin:admin@localhost:27017)

3. **Access the Application:**
   - Open your browser and go to [http://localhost:3000](http://localhost:3000)
   - Sign up as a Product Owner or log in as an Admin/Developer.

---

## Project Structure

```
TMS/
  backend/         # Node.js/Express API, MongoDB models, routes, middleware
  frontend/        # React app, Chakra UI, i18next, all UI components
  elk_stack/       # ELK stack configs for logging/monitoring
  docker-compose.yml
```

---

## Main Pages & Functionality

- **Sign In/Sign Up**: User authentication and registration.
- **Dashboard**: Overview and quick access to main features.
- **Profile**: View and edit user information, access API link and secret key.
- **Apps**: Manage your projects (create, update, delete).
- **Translations**: Manage translations for each app (add, update, validate, publish, delete).
- **Developers**: Manage developer accounts (create, activate/deactivate).
- **Documentation**: In-app documentation and language switching.

---

## API Usage

- Each app provides an API endpoint and secret key for accessing translations programmatically.
- Example endpoint: `GET /api/translations/:lng` (where `:lng` is `en`, `fr`, or `ar`).

---

## Internationalization

- Fully supports English, French, and Arabic.
- Language can be switched dynamically in the UI.
- All UI text and documentation are available in all supported languages.

---

## Monitoring & Logging

- **Prometheus**: Metrics endpoint exposed for backend monitoring.
- **ELK Stack**: Centralized logging for all services (see `/elk_stack`).

---

## Development

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Create a new Pull Request

---

## License

This project is licensed under the MIT License.

---

## Credits

- UI based on [Horizon UI (Chakra)](https://horizon-ui.com/horizon-ui-chakra)
- Built with [React](https://reactjs.org/), [Chakra UI](https://chakra-ui.com/), [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [MongoDB](https://www.mongodb.com/), [i18next](https://www.i18next.com/), [Prometheus](https://prometheus.io/), and [ELK Stack](https://www.elastic.co/what-is/elk-stack).
