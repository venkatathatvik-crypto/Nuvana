import { motion } from "framer-motion";
import {
  Upload,
  Users,
  FileText,
  Bell,
  Calendar,
  TrendingUp,
  BarChart2,
  Mic,
  LogOut,
  Shield,
  CheckSquare,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/auth/AuthContext";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  const quickActions = [
    {
      label: "Upload Marks",
      icon: Upload,
      color: "text-neon-purple",
      path: "/teacher/marks",
    },
    {
      label: "Post Attendance",
      icon: Users,
      color: "text-neon-cyan",
      path: "/teacher/attendance",
    },
    {
      label: "Upload Files",
      icon: FileText,
      color: "text-neon-pink",
      path: "/teacher/files",
    },
    {
      label: "Send Announcement",
      icon: Bell,
      color: "text-neon-blue",
      path: "/teacher/announcements",
    },
    {
      label: "Manage Tests",
      icon: FileText,
      color: "text-neon-purple",
      path: "/teacher/tests",
    },
    {
      label: "Analytics",
      icon: BarChart2,
      color: "text-green-500",
      path: "/teacher/analytics",
    },
    {
      label: "Voice Upload",
      icon: Mic,
      color: "text-neon-pink",
      path: "/teacher/voice-upload",
    },
    {
      label: "Admin Panel",
      icon: Shield,
      color: "text-neon-purple",
      path: "/teacher/admin",
    },
    {
      label: "My Tasks",
      icon: CheckSquare,
      color: "text-neon-cyan",
      path: "/teacher/tasks",
    },
  ];

  const classStats = [
    { class: "Class 10A", students: 45, avgAttendance: "92%" },
    { class: "Class 10B", students: 42, avgAttendance: "89%" },
    { class: "Class 11A", students: 38, avgAttendance: "94%" },
  ];

  const recentActivity = [
    { action: "Uploaded marks for Mathematics midterm", time: "1 hour ago" },
    { action: "Posted attendance for Class 10A", time: "3 hours ago" },
    { action: "Uploaded lecture notes - Chapter 5", time: "5 hours ago" },
    { action: "Announced test schedule", time: "1 day ago" },
  ];

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold neon-text mb-2">
              Teacher Dashboard 📚
            </h1>
            <p className="text-muted-foreground">
              Manage your classes and students efficiently
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="glass hover:neon-glow"
              onClick={() => navigate("/teacher/profile")}
            >
              <Users className="mr-2 w-4 h-4" />
              My Profile
            </Button>
            <Button
              variant="outline"
              className="glass hover:neon-glow text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 w-4 h-4" />
              Logout
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                className="w-full h-32 glass-card hover:neon-glow flex flex-col gap-3 text-lg"
                variant="outline"
                onClick={() => navigate(action.path)}
              >
                <action.icon className={`w-8 h-8 ${action.color}`} />
                {action.label}
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">Class Overview</h2>
              </div>
              <div className="space-y-4">
                {classStats.map((cls, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{cls.class}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {cls.students} students
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {cls.avgAttendance}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Avg Attendance
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-semibold">Recent Activity</h2>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary transition-colors"
                  >
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {activity.time}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • Upload marks regularly to keep students updated on their
                progress
              </li>
              <li>• Use announcements to communicate important information</li>
              <li>
                • Check attendance trends to identify students who need
                attention
              </li>
              <li>
                • Share study materials and resources to help students learn
                better
              </li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
