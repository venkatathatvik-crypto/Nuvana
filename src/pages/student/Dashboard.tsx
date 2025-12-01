import { motion } from "framer-motion";
import { BookOpen, Calendar, FileText, Bell, Award, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const quickStats = [
    { label: "Attendance", value: "87%", icon: Users, color: "text-neon-cyan" },
    { label: "Upcoming Tests", value: "3", icon: Calendar, color: "text-neon-purple" },
    { label: "Assignments", value: "5", icon: FileText, color: "text-neon-pink" },
    { label: "Average Marks", value: "82%", icon: Award, color: "text-neon-blue" },
  ];

  const todayClasses = [
    { subject: "Mathematics", time: "9:00 AM - 10:30 AM", room: "Room 301" },
    { subject: "Physics", time: "11:00 AM - 12:30 PM", room: "Lab 2" },
    { subject: "Computer Science", time: "2:00 PM - 3:30 PM", room: "Room 105" },
  ];

  const announcements = [
    { title: "Mid-term exams schedule released", time: "2 hours ago", urgent: true },
    { title: "Library hours extended this week", time: "5 hours ago", urgent: false },
    { title: "Sports day registration open", time: "1 day ago", urgent: false },
  ];

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold neon-text mb-2">
            Welcome back, Student! 👋
          </h1>
          <p className="text-muted-foreground">Here's what's happening today</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card p-6 hover:neon-glow transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
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
                    <p className="text-sm text-muted-foreground mt-1">{cls.time}</p>
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
              <div className="space-y-4">
                {announcements.map((announcement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border transition-colors ${
                      announcement.urgent
                        ? "bg-destructive/10 border-destructive"
                        : "bg-muted/50 border-border hover:border-primary"
                    }`}
                  >
                    <h3 className="font-semibold">{announcement.title}</h3>
                    <p className="text-xs text-muted-foreground mt-2">{announcement.time}</p>
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
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          <Button className="h-24 text-lg glass hover:neon-glow" variant="outline">
            <BookOpen className="mr-2 w-6 h-6" />
            Books
          </Button>
          <Button className="h-24 text-lg glass hover:neon-glow" variant="outline">
            <FileText className="mr-2 w-6 h-6" />
            Notes
          </Button>
          <Button className="h-24 text-lg glass hover:neon-glow" variant="outline">
            <Award className="mr-2 w-6 h-6" />
            Marks
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
