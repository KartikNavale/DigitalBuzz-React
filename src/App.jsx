 import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import RootLayout from "./RootLayout";
import Calendar from "./pages/calendar";
import Dropdown from "./components/Dropdown";
import Chart from "./components/Chart";
import Document from "./components/Document";
import Notification from "./components/Notification";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Navigate to="/calendar" replace />} />

          <Route path="/calendar" element={<Calendar />} />
          <Route path="/dropdown" element={<Dropdown />} />
          <Route path="/chart" element={<Chart />} />
          <Route path="/document" element={<Document />} />
          <Route path="/notification" element={<Notification />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
