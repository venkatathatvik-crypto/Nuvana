import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/auth/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

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
import AuthRedirect from "./components/AuthRedirect";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider
        defaultTheme="dark"
        storageKey="vite-ui-theme"
        attribute="class"
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ThemeToggle />

          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <AuthRedirect>
                    <Index />
                  </AuthRedirect>
                }
              />
              <Route
                path="/login"
                element={
                  <AuthRedirect>
                    <Login />
                  </AuthRedirect>
                }
              />
              <Route
                path="/signup"
                element={
                  <AuthRedirect>
                    <Signup />
                  </AuthRedirect>
                }
              />

              {/* Student Protected Routes */}
              <Route
                path="/student"
                element={
                  <ProtectedRoute role="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/attendance"
                element={
                  <ProtectedRoute role="student">
                    <StudentAttendance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/marks"
                element={
                  <ProtectedRoute role="student">
                    <StudentMarks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/books"
                element={
                  <ProtectedRoute role="student">
                    <StudentBooks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/notes"
                element={
                  <ProtectedRoute role="student">
                    <StudentNotes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/events"
                element={
                  <ProtectedRoute role="student">
                    <StudentEvents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/timetable"
                element={
                  <ProtectedRoute role="student">
                    <StudentTimetable />
                  </ProtectedRoute>
                }
              />

              {/* Teacher Protected Routes */}
              <Route
                path="/teacher"
                element={
                  <ProtectedRoute role="teacher">
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/attendance"
                element={
                  <ProtectedRoute role="teacher">
                    <TeacherAttendance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/marks"
                element={
                  <ProtectedRoute role="teacher">
                    <TeacherMarks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/files"
                element={
                  <ProtectedRoute role="teacher">
                    <TeacherFiles />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/announcements"
                element={
                  <ProtectedRoute role="teacher">
                    <TeacherAnnouncements />
                  </ProtectedRoute>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
