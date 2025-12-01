import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
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

import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme" attribute="class">
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <ThemeToggle />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Student Routes */}
              <Route
                path="/student/*"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <Routes>
                      <Route path="/" element={<StudentDashboard />} />
                      <Route path="/attendance" element={<StudentAttendance />} />
                      <Route path="/marks" element={<StudentMarks />} />
                      <Route path="/books" element={<StudentBooks />} />
                      <Route path="/notes" element={<StudentNotes />} />
                      <Route path="/events" element={<StudentEvents />} />
                      <Route path="/timetable" element={<StudentTimetable />} />
                    </Routes>
                  </ProtectedRoute>
                }
              />

              {/* Teacher Routes */}
              <Route
                path="/teacher/*"
                element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <Routes>
                      <Route path="/" element={<TeacherDashboard />} />
                      <Route path="/attendance" element={<TeacherAttendance />} />
                      <Route path="/marks" element={<TeacherMarks />} />
                      <Route path="/files" element={<TeacherFiles />} />
                      <Route path="/announcements" element={<TeacherAnnouncements />} />
                    </Routes>
                  </ProtectedRoute>
                }
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
