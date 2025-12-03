import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthContext";
import { getStudentData, getStudentTests, StudentTest } from "@/services/academic";
import LoadingSpinner from "@/components/LoadingSpinner";

const StudentTests = () => {
    const navigate = useNavigate();
    const { profile, profileLoading } = useAuth();
    const [tests, setTests] = useState<StudentTest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTests = async () => {
            if (profileLoading) return;

            if (!profile) {
                setLoading(false);
                return;
            }

            try {
                // First get student data to get class_id
                const studentData = await getStudentData(profile.id);
                if (!studentData) {
                    toast.error("Student data not found");
                    setLoading(false);
                    return;
                }

                // Fetch published tests for student's class
                const testsData = await getStudentTests(studentData.class_id);
                setTests(testsData);
            } catch (error: any) {
                console.error("Error fetching tests:", error);
                toast.error("Failed to load tests");
            } finally {
                setLoading(false);
            }
        };

        fetchTests();
    }, [profile, profileLoading]);

    if (loading || profileLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-4xl font-bold neon-text mb-2">My Assessments 📝</h1>
                <p className="text-muted-foreground">Take tests and view your progress</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map((test, index) => (
                    <motion.div
                        key={test.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="glass-card hover:border-primary transition-colors">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-start">
                                    <span className="truncate">{test.title}</span>
                                    {test.subjectName && (
                                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                                            {test.subjectName}
                                        </span>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {test.description || "No description provided."}
                                </p>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {test.durationMinutes} mins
                                    </div>
                                    <div>{test.questionCount} Questions</div>
                                    <div>{test.totalMarks} Marks</div>
                                </div>

                                <Button className="w-full mt-4" onClick={() => navigate(`/student/tests/${test.id}`)}>
                                    <Play className="w-4 h-4 mr-2" /> Start Test
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}

                {tests.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        <p>No tests available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentTests;
