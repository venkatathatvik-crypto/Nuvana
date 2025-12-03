import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Award, BookOpen, Star, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const StudentProfile = () => {
    const navigate = useNavigate();
    // Mock data - in a real app this would come from context or API
    const student = {
        name: "Alex Johnson",
        id: "ST-2024-001",
        email: "alex.j@student.nuvana.edu",
        phone: "+1 (555) 123-4567",
        address: "123 Campus Drive, Student Dorm A",
        grade: "12th Grade",
        section: "A",
        gpa: "3.8",
        attendance: "92%"
    };

    // Mock logic for feedback activation (once a year)
    // For demo purposes, we'll toggle this with a state or just set it to true
    const [isFeedbackActive] = useState(true);

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-between"
                >
                    <h1 className="text-4xl font-bold neon-text">My Profile</h1>
                    <Button variant="outline" className="glass hover:neon-glow" onClick={() => navigate("/student")}>
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
                            <h2 className="text-2xl font-bold text-foreground">{student.name}</h2>
                            <p className="text-muted-foreground">{student.id}</p>
                            <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
                                    {student.grade}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm border border-accent/20">
                                    Section {student.section}
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
                                <User className="w-5 h-5 text-primary" /> Personal Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                                    <Mail className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-medium">{student.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                                    <Phone className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Phone</p>
                                        <p className="font-medium">{student.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                                    <MapPin className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Address</p>
                                        <p className="font-medium">{student.address}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Stats & Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="glass-card p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-neon-purple/20 text-neon-purple">
                                    <Award className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Current GPA</p>
                                    <p className="text-2xl font-bold">{student.gpa}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="glass-card p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-neon-cyan/20 text-neon-cyan">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Attendance</p>
                                    <p className="text-2xl font-bold">{student.attendance}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Card className={`glass-card p-6 border-l-4 ${isFeedbackActive ? 'border-l-neon-pink' : 'border-l-muted'}`}>
                            <div className="flex flex-col h-full justify-between">
                                <div>
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Star className={`w-5 h-5 ${isFeedbackActive ? 'text-neon-pink fill-neon-pink' : 'text-muted'}`} />
                                        Annual Feedback
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {isFeedbackActive
                                            ? "The annual feedback survey is now open. Please share your thoughts."
                                            : "Feedback survey is currently closed."}
                                    </p>
                                </div>
                                <Button
                                    className={`mt-4 w-full ${isFeedbackActive ? 'bg-neon-pink/20 text-neon-pink hover:bg-neon-pink/30' : ''}`}
                                    disabled={!isFeedbackActive}
                                    onClick={() => navigate("/student/feedback")}
                                >
                                    {isFeedbackActive ? "Give Feedback" : "Closed"}
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
