import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Briefcase, BookOpen, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TeacherProfile = () => {
    const navigate = useNavigate();
    // Mock data
    const teacher = {
        name: "Sarah Wilson",
        id: "TC-2024-055",
        email: "sarah.wilson@nuvana.edu",
        phone: "+1 (555) 987-6543",
        department: "Science",
        designation: "Senior Lecturer",
        subjects: ["Physics", "Advanced Mathematics"],
        classes: ["10-A", "11-B", "12-A"]
    };

    return (
        <div className="min-h-screen p-6 bg-background">
            <div className="max-w-4xl mx-auto space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-between"
                >
                    <h1 className="text-4xl font-bold neon-text">My Profile</h1>
                    <Button variant="outline" className="glass hover:neon-glow" onClick={() => navigate("/teacher")}>
                        Back to Dashboard
                    </Button>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-1"
                    >
                        <Card className="glass-card p-6 flex flex-col items-center text-center h-full">
                            <div className="w-32 h-32 rounded-full bg-secondary/50 flex items-center justify-center mb-4 border-2 border-primary/50 relative overflow-hidden">
                                <User className="w-16 h-16 text-muted-foreground" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">{teacher.name}</h2>
                            <p className="text-muted-foreground">{teacher.id}</p>
                            <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
                                    {teacher.department}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm border border-accent/20">
                                    {teacher.designation}
                                </span>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Details Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-2"
                    >
                        <Card className="glass-card p-6 h-full">
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" /> Contact Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                                    <Mail className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-medium">{teacher.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                                    <Phone className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Phone</p>
                                        <p className="font-medium">{teacher.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Department</p>
                                        <p className="font-medium">{teacher.department}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Stats & Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="glass-card p-6 h-full">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-neon-blue" /> Subjects Taught
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {teacher.subjects.map((subject) => (
                                    <span key={subject} className="px-3 py-1 rounded-md bg-secondary/50 border border-white/10">
                                        {subject}
                                    </span>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="glass-card p-6 h-full">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-neon-purple" /> Assigned Classes
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {teacher.classes.map((cls) => (
                                    <span key={cls} className="px-3 py-1 rounded-md bg-secondary/50 border border-white/10">
                                        Class {cls}
                                    </span>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfile;
