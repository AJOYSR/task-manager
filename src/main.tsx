import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";
import { LoginContextProvider } from "./context/userContext/LoginContext.tsx";
import HomePage from "./components/HomePage.tsx";
import Navbar from "./components/Navbar.tsx";
import Members from "./components/Members.tsx";
import Tasks from './components/Tasks';
import TaskDetails from "./components/TaskDetails.tsx";
import MemberDetails from "./components/MemberDetails.tsx";
import AddorEditTask from "./components/AddorEditTask.tsx";
import AddOrEditMember from "./components/AddOrEditMember.tsx";



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LoginContextProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/members" element={<Members />} />
          <Route path="/task-details/:id" element={<TaskDetails />} />
          <Route path="/member-details/:id" element={<MemberDetails />} />
          <Route path="/add-or-edit" element={<AddorEditTask />} />
          <Route path="/add-or-edit/:id" element={<AddorEditTask />} />
          <Route path="/add-or-edit-member" element={<AddOrEditMember />} />
          <Route path="/add-or-edit-member/:id" element={<AddOrEditMember />} />
        </Routes>
      </LoginContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
