import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <GraduationCap className="w-20 h-20 text-primary neon-glow" />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-4 neon-text">
            Nuvana360
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Your complete 360° academic companion for learning, teaching, and thriving
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full"
        >
          <Card
            className="glass-card p-8 hover:neon-glow transition-all duration-300 cursor-pointer group"
            onClick={() => navigate("/login")}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <BookOpen className="w-16 h-16 text-neon-cyan group-hover:scale-110 transition-transform" />
              <h2 className="text-3xl font-bold">Student Mode</h2>
              <p className="text-muted-foreground">
                Access your personalized dashboard with attendance, marks, timetable, books, and more
              </p>
              <Button className="w-full mt-4" size="lg">
                Enter as Student
              </Button>
            </div>
          </Card>

          <Card
            className="glass-card p-8 hover:neon-glow transition-all duration-300 cursor-pointer group"
            onClick={() => navigate("/login")}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <Users className="w-16 h-16 text-neon-purple group-hover:scale-110 transition-transform" />
              <h2 className="text-3xl font-bold">Teacher Mode</h2>
              <p className="text-muted-foreground">
                Manage classes, upload marks, post attendance, share files, and make announcements
              </p>
              <Button className="w-full mt-4" size="lg" variant="secondary">
                Enter as Teacher
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Powered by modern technology • Designed for excellence
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
