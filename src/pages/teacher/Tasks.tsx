import { useState } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Clock, BookOpen, AlertCircle, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const TeacherTasks = () => {
    const navigate = useNavigate();

    // Mock Data for Grading Tasks
    const [gradingTasks, setGradingTasks] = useState([
        { id: 1, title: "Math Midterm Papers", class: "Class 10A", pending: 15, total: 45, due: "Today", urgency: "high" },
        { id: 2, title: "Physics Lab Reports", class: "Class 11B", pending: 28, total: 40, due: "Tomorrow", urgency: "medium" },
        { id: 3, title: "English Essays", class: "Class 10B", pending: 5, total: 42, due: "In 2 days", urgency: "low" },
    ]);

    // Mock Data for Syllabus/Topics
    const [todaysSchedule, setTodaysSchedule] = useState([
        {
            id: 1,
            time: "09:00 AM - 10:00 AM",
            class: "Class 10A",
            subject: "Mathematics",
            topic: "Quadratic Equations - Introduction",
            status: "completed"
        },
        {
            id: 2,
            time: "10:30 AM - 11:30 AM",
            class: "Class 11B",
            subject: "Physics",
            topic: "Newton's Third Law & Applications",
            status: "upcoming"
        },
        {
            id: 3,
            time: "01:00 PM - 02:00 PM",
            class: "Class 10B",
            subject: "Mathematics",
            topic: "Arithmetic Progressions - Problem Solving",
            status: "upcoming"
        },
    ]);

    const handleMarkDone = (id: number) => {
        setTodaysSchedule(prev => prev.map(item =>
            item.id === id ? { ...item, status: "completed" } : item
        ));
        toast.success("Topic marked as covered!");
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case "high": return "text-red-500 border-red-500/50 bg-red-500/10";
            case "medium": return "text-yellow-500 border-yellow-500/50 bg-yellow-500/10";
            case "low": return "text-green-500 border-green-500/50 bg-green-500/10";
            default: return "text-muted-foreground";
        }
    };

    return (
        <div className="min-h-screen p-6 bg-background">
            <div className="max-w-7xl mx-auto space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-4xl font-bold neon-text mb-2">My Tasks 📝</h1>
                        <p className="text-muted-foreground">Manage grading and daily syllabus coverage</p>
                    </div>
                    <Button variant="outline" className="glass" onClick={() => navigate("/teacher")}>
                        Back to Dashboard
                    </Button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Grading Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-2">
                            <CheckSquare className="w-6 h-6 text-neon-pink" />
                            <h2 className="text-2xl font-semibold">Grading Queue</h2>
                        </div>

                        <div className="space-y-4">
                            {gradingTasks.map((task) => (
                                <Card key={task.id} className="glass-card p-6 hover:border-neon-pink/50 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-semibold text-lg">{task.title}</h3>
                                            <p className="text-sm text-muted-foreground">{task.class}</p>
                                        </div>
                                        <Badge variant="outline" className={getUrgencyColor(task.urgency)}>
                                            Due {task.due}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Progress</span>
                                            <span>{task.total - task.pending} / {task.total} graded</span>
                                        </div>
                                        <Progress value={((task.total - task.pending) / task.total) * 100} className="h-2" />
                                    </div>

                                    <div className="mt-4 flex justify-end">
                                        <Button size="sm" className="neon-glow" onClick={() => navigate("/teacher/marks")}>
                                            Grade Now <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                </Card>
                            ))}

                            {gradingTasks.length === 0 && (
                                <Card className="glass-card p-8 text-center text-muted-foreground">
                                    <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>All caught up! No pending grading tasks.</p>
                                </Card>
                            )}
                        </div>
                    </motion.div>

                    {/* Syllabus Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-neon-cyan" />
                            <h2 className="text-2xl font-semibold">Today's Syllabus</h2>
                        </div>

                        <div className="relative border-l-2 border-dashed border-white/10 ml-4 space-y-8 pb-4">
                            {todaysSchedule.map((item, index) => (
                                <div key={item.id} className="relative pl-8">
                                    {/* Timeline Dot */}
                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${item.status === 'completed'
                                            ? 'bg-green-500 border-green-500'
                                            : 'bg-background border-neon-cyan'
                                        }`} />

                                    <Card className={`glass-card p-5 transition-all ${item.status === 'completed' ? 'opacity-70' : 'hover:neon-glow'
                                        }`}>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-2 text-sm text-neon-cyan font-mono">
                                                <Clock className="w-4 h-4" />
                                                {item.time}
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-lg">{item.topic}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="secondary">{item.subject}</Badge>
                                                    <Badge variant="outline">{item.class}</Badge>
                                                </div>
                                            </div>

                                            {item.status !== 'completed' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="self-start mt-2 hover:bg-green-500/20 hover:text-green-500 hover:border-green-500"
                                                    onClick={() => handleMarkDone(item.id)}
                                                >
                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                    Mark as Covered
                                                </Button>
                                            )}

                                            {item.status === 'completed' && (
                                                <div className="flex items-center gap-2 text-green-500 text-sm mt-2">
                                                    <CheckCircle2 className="w-4 h-4" /> Covered
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default TeacherTasks;
