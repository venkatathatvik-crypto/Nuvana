import { motion } from "framer-motion";
import { ArrowLeft, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const Attendance = () => {
  const navigate = useNavigate();

  const overallAttendance = 87;

  const subjectAttendance = [
    { 
      subject: "Mathematics", 
      present: 42, 
      total: 48, 
      percentage: 87.5,
      trend: "up",
      recentClasses: [
        { date: "2024-11-28", status: "present" },
        { date: "2024-11-25", status: "present" },
        { date: "2024-11-22", status: "absent" },
        { date: "2024-11-19", status: "present" },
        { date: "2024-11-16", status: "present" },
      ]
    },
    { 
      subject: "Physics", 
      present: 38, 
      total: 45, 
      percentage: 84.4,
      trend: "down",
      recentClasses: [
        { date: "2024-11-27", status: "present" },
        { date: "2024-11-24", status: "absent" },
        { date: "2024-11-21", status: "present" },
        { date: "2024-11-18", status: "absent" },
        { date: "2024-11-15", status: "present" },
      ]
    },
    { 
      subject: "Chemistry", 
      present: 40, 
      total: 44, 
      percentage: 90.9,
      trend: "up",
      recentClasses: [
        { date: "2024-11-28", status: "present" },
        { date: "2024-11-26", status: "present" },
        { date: "2024-11-23", status: "present" },
        { date: "2024-11-20", status: "present" },
        { date: "2024-11-17", status: "absent" },
      ]
    },
    { 
      subject: "Computer Science", 
      present: 44, 
      total: 50, 
      percentage: 88.0,
      trend: "up",
      recentClasses: [
        { date: "2024-11-29", status: "present" },
        { date: "2024-11-27", status: "present" },
        { date: "2024-11-24", status: "present" },
        { date: "2024-11-21", status: "absent" },
        { date: "2024-11-18", status: "present" },
      ]
    },
    { 
      subject: "English", 
      present: 36, 
      total: 42, 
      percentage: 85.7,
      trend: "down",
      recentClasses: [
        { date: "2024-11-28", status: "absent" },
        { date: "2024-11-25", status: "present" },
        { date: "2024-11-22", status: "present" },
        { date: "2024-11-19", status: "present" },
        { date: "2024-11-16", status: "absent" },
      ]
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/student")}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold neon-text">Attendance</h1>
            <p className="text-muted-foreground">Track your class attendance</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center md:text-left">
                <p className="text-lg text-muted-foreground mb-2">Overall Attendance</p>
                <p className="text-6xl font-bold neon-text">{overallAttendance}%</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Keep it above 75% to avoid attendance issues
                </p>
              </div>
              <div className="relative w-48 h-48">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 80}`}
                    strokeDashoffset={`${2 * Math.PI * 80 * (1 - overallAttendance / 100)}`}
                    className="text-primary neon-glow"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-primary" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Subject-wise Attendance</h2>
          {subjectAttendance.map((subject, index) => (
            <motion.div
              key={subject.subject}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="glass-card p-6 hover:neon-glow transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{subject.subject}</h3>
                      <p className="text-sm text-muted-foreground">
                        {subject.present} / {subject.total} classes
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-3xl font-bold text-primary">
                          {subject.percentage.toFixed(1)}%
                        </p>
                      </div>
                      {subject.trend === "up" ? (
                        <TrendingUp className="w-6 h-6 text-neon-cyan" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-destructive" />
                      )}
                    </div>
                  </div>

                  <Progress value={subject.percentage} className="h-2" />

                  <div>
                    <p className="text-sm font-medium mb-2">Recent Classes:</p>
                    <div className="flex gap-2 flex-wrap">
                      {subject.recentClasses.map((cls, idx) => (
                        <div
                          key={idx}
                          className={`px-3 py-2 rounded-lg text-xs font-medium ${
                            cls.status === "present"
                              ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30"
                              : "bg-destructive/20 text-destructive border border-destructive/30"
                          }`}
                        >
                          <p>{cls.date}</p>
                          <p className="capitalize">{cls.status}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="glass-card p-6 bg-primary/5 border-primary/30">
            <h3 className="font-semibold mb-2">💡 Attendance Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Maintain at least 75% attendance in all subjects</li>
              <li>• Check your attendance regularly to avoid surprises</li>
              <li>• Contact your teachers if you notice any discrepancies</li>
              <li>• Plan your leaves wisely to maintain good attendance</li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Attendance;
