import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../../pages/Home/index";
import RepoPage from "../../pages/Repo/index";

export const AppRouter: React.FC = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/repo/:name" element={<RepoPage />} />
    <Route path="*" element={<Navigate replace to="/" />} />
  </Routes>
);
