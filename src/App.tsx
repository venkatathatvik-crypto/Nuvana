import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import StudentDashboard from "./pages/student/Dashboard";
import StudentAttendance from "./pages/student/Attendance";
import StudentMarks from "./pages/student/Marks";
import StudentBooks from "./pages/student/Books";
import StudentNotes from "./pages/student/Notes";
import StudentEvents from "./pages/student/Events";
import StudentTimetable from "./pages/student/Timetable";
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherAttendance from "./pages/teacher/Attendance";
import TeacherMarks from "./pages/teacher/Marks";
import TeacherFiles from "./pages/teacher/Files";
import TeacherAnnouncements from "./pages/teacher/Announcements";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/attendance" element={<StudentAttendance />} />
          <Route path="/student/marks" element={<StudentMarks />} />
          <Route path="/student/books" element={<StudentBooks />} />
          <Route path="/student/notes" element={<StudentNotes />} />
          <Route path="/student/events" element={<StudentEvents />} />
          <Route path="/student/timetable" element={<StudentTimetable />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/attendance" element={<TeacherAttendance />} />
          <Route path="/teacher/marks" element={<TeacherMarks />} />
          <Route path="/teacher/files" element={<TeacherFiles />} />
          <Route path="/teacher/announcements" element={<TeacherAnnouncements />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
