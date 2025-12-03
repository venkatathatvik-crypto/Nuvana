import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  FileText,
  Bell,
  Award,
  Users,
  StickyNote,
  LogOut,
  BarChart2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { useEffect, useState } from "react";
import {
  getStudentData,
  getStudentAnnouncements,
  getOverallAttendancePercentage,
  getStudentAverageMarksPercentage,
  getStudentPendingTestsCount,
} from "@/services/academic";
import LoadingSpinner from "@/components/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, profile, profileLoading } = useAuth();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [studentClassId, setStudentClassId] = useState<string | null>(null);
  const [attendancePercentage, setAttendancePercentage] = useState<
    number | null
  >(null);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [averageMarks, setAverageMarks] = useState<number | null>(null);
  const [loadingMarks, setLoadingMarks] = useState(true);
  const [pendingTests, setPendingTests] = useState<number>(0);
  const [loadingTests, setLoadingTests] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      if (profileLoading) return;

      if (!profile) {
        setLoadingAnnouncements(false);
        setLoadingAttendance(false);
        setLoadingMarks(false);
        setLoadingTests(false);
        return;
      }

      try {
        // Fetch attendance percentage
        const attendance = await getOverallAttendancePercentage(profile.id);
        setAttendancePercentage(Math.round(attendance * 10) / 10);

        // Fetch average marks percentage
        const marks = await getStudentAverageMarksPercentage(profile.id);
        setAverageMarks(marks);

        // Fetch pending tests count
        const pending = await getStudentPendingTestsCount(profile.id);
        setPendingTests(pending);

        // Get student data to get class_id
        const studentData = await getStudentData(profile.id);
        if (studentData && studentData.class_id) {
          setStudentClassId(studentData.class_id);
          // Fetch announcements for this class
          const announcementsData = await getStudentAnnouncements(
            studentData.class_id
          );
          setAnnouncements(announcementsData);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoadingAnnouncements(false);
        setLoadingAttendance(false);
        setLoadingMarks(false);
        setLoadingTests(false);
      }
    };

    fetchStudentData();
  }, [profile, profileLoading]);

  const quickStats = [
    {
      label: "Attendance",
      value: loadingAttendance ? "..." : `${attendancePercentage}%`,
      icon: Users,
      color: "text-neon-cyan",
      path: "/student/attendance",
    },
    {
      label: "Pending Tests",
      value: loadingTests ? "..." : pendingTests.toString(),
      icon: Calendar,
      color: "text-neon-purple",
      path: "/student/tests",
    },
    {
      label: "Assignments",
      value: "5",
      icon: FileText,
      color: "text-neon-pink",
      path: "/student/events",
    },
    {
      label: "Average Marks",
      value: loadingMarks ? "..." : `${averageMarks}%`,
      icon: Award,
      color: "text-blue-500",
      path: "/student/marks",
    },
    {
      label: "My Analytics",
      value: "View",
      icon: BarChart2,
      color: "text-green-500",
      path: "/student/analytics",
    },
  ];

  const todayClasses = [
    { subject: "Mathematics", time: "9:00 AM - 10:30 AM", room: "Room 301" },
    { subject: "Physics", time: "11:00 AM - 12:30 PM", room: "Lab 2" },
    {
      subject: "Computer Science",
      time: "2:00 PM - 3:30 PM",
      room: "Room 105",
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold neon-text mb-2">
              Welcome back, Student! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening today
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="glass hover:neon-glow"
              onClick={() => navigate("/student/profile")}
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
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="glass-card p-6 hover:neon-glow transition-all duration-300 cursor-pointer"
                onClick={() => navigate(stat.path)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-10 h-10 ${stat.color}`} />
                </div>
              </Card>
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
                <Calendar className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">Today's Classes</h2>
              </div>
              <div className="space-y-4">
                {todayClasses.map((cls, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary transition-colors"
                  >
                    <h3 className="font-semibold text-lg">{cls.subject}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {cls.time}
                    </p>
                    <p className="text-xs text-muted-foreground">{cls.room}</p>
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
                <Bell className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-semibold">Announcements</h2>
              </div>
              {loadingAnnouncements ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : announcements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No announcements available.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className={`p-4 rounded-lg border transition-colors ${
                        announcement.isUrgent
                          ? "bg-destructive/10 border-destructive"
                          : "bg-muted/50 border-border hover:border-primary"
                      }`}
                    >
                      <h3 className="font-semibold">{announcement.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        {announcement.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(new Date(announcement.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          <Button
            className="h-24 text-lg bg-secondary/50 backdrop-blur-md border-white/10 hover:neon-glow"
            variant="outline"
            onClick={() => navigate("/student/timetable")}
          >
            <Calendar className="mr-2 w-6 h-6" />
            Timetable
          </Button>
          <Button
            className="h-24 text-lg bg-secondary/50 backdrop-blur-md border-white/10 hover:neon-glow"
            variant="outline"
            onClick={() => navigate("/student/notes")}
          >
            <StickyNote className="mr-2 w-6 h-6" />
            Notes
          </Button>
          <Button
            className="h-24 text-lg bg-secondary/50 backdrop-blur-md border-white/10 hover:neon-glow"
            variant="outline"
            onClick={() => navigate("/student/books")}
          >
            <BookOpen className="mr-2 w-6 h-6" />
            Books
          </Button>
          <Button
            className="h-24 text-lg glass hover:neon-glow"
            variant="outline"
            onClick={() => navigate("/student/tests")}
          >
            <FileText className="mr-2 w-6 h-6" />
            My Tests
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
