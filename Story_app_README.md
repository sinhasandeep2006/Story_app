
# Story_app

Story_app is a full-stack storytelling platform designed with a **frontend** for user interaction and a **backend** for managing the application's data and logic. The application allows users to create, explore, and share stories.

---

## Project Structure

The project consists of two main parts:

### **Backend**
Located in the `backend/` folder:
- **`index.js`**: The main entry point for the backend server.
- **`models/`**: Contains the database models (likely for MongoDB or similar).
- **`uploads/`**: A directory for storing uploaded files.
- **`utilities.js` and `multer.js`**: Utility files for handling various backend logic (e.g., file uploads).
- **Configuration**:
  - `.env`: Contains environment variables (e.g., database URL, secret keys).
  - `config.json`: Stores additional configuration options.
  - `package.json`: Lists dependencies for the backend.

### **Frontend**
Located in the `frontend/` folder:
- **`src/`**: Contains the source code for the React-based frontend.
- **`public/`**: Stores static assets like `index.html`.
- **`tailwind.config.js`**: Tailwind CSS configuration for styling.
- **`vite.config.js`**: Configuration for the Vite development server.
- **Configuration**:
  - `eslint.config.js`: Linter configuration for maintaining code quality.
  - `package.json`: Lists dependencies for the frontend.

---

## Features

### Frontend
- **Responsive UI**: Built with React and styled using Tailwind CSS.
- **Story Management**: Create, browse, and interact with stories.
- **Optimized Performance**: Uses Vite for fast development and builds.

### Backend
- **File Uploads**: Handled via `multer.js` and stored in the `uploads/` folder.
- **Database Models**: Defined in the `models/` folder to handle user and story data.
- **API Endpoints**: RESTful APIs for CRUD operations and user authentication.

---

## Installation

### Prerequisites
Ensure you have the following installed:
- **Node.js** (latest LTS version recommended)
- **npm** or **yarn**
- **MongoDB** (or a similar database)

### Steps to Run

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sinhasandeep2006/Story_app.git
   cd Story_app
   ```

2. **Set Up the Backend**:
   ```bash
   cd backend
   npm install
   npm start
   ```
   - Configure the `.env` file with database connection strings and secrets.
   - Ensure MongoDB is running locally or provide a cloud connection string.

3. **Set Up the Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   - The development server will start, and you can access it at `http://localhost:3000`.

---

## Usage

- **Sign Up**: Create a user account.
- **Create Stories**: Write and share your stories with the platform.
- **Browse and Interact**: Read stories, leave comments, and engage with other users.

---

## Contributing

Contributions are welcome! Follow these steps to contribute:
1. **Fork the repository**.
2. **Create a new branch**:
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. **Make your changes and commit**:
   ```bash
   git commit -m "Add feature: YourFeatureName"
   ```
4. **Push to your branch**:
   ```bash
   git push origin feature/YourFeatureName
   ```
5. **Submit a Pull Request**.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For any inquiries or feedback, reach out to:
- **Sandeep Sinha**: 1233sandeepsinha@gmail.com
