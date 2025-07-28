import "./App.css";

// import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Navigate, Routes, } from "react-router-dom";
import Login from "./login";
import AdminDashboard from "./Admin/AdminDashboard";
import StudentDashBoard from "./Student/StudentDashBoard";
import StudentsList from "./Admin/StudentsList";
import SlotBooking from "./Admin/SlotBooking";
import Rules from "./Student/Rules";
import ExamScreen from "./Student/ExamScreen";
import CreateQuestions from "./Admin/CreateQuestions";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Admin module */}
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/StudentsList" element={<StudentsList />} />
        <Route path="/StudentsList/Slotbooking" element={<SlotBooking />} />
        <Route path="/createQuestions" element={<CreateQuestions />} />

      {/* Student */}
       <Route path="/studentDashboard" element={<StudentDashBoard />} />
       <Route path="/rules" element={<Rules />} />
       <Route path="/examscreen" element={<ExamScreen />} />

             
      </Routes>
    </BrowserRouter>
  );
}

export default App;
