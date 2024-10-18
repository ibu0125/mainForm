import React from "react";
import MainForm from "./Compornent/MainForm";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/:id" element={<MainForm />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
