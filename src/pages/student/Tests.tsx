import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mcqStore, Test, Submission } from "@/lib/mcq-store";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const StudentTests = () => {
    const navigate = useNavigate();
    const [tests, setTests] = useState<Test[]>([]);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const studentId = "student-1"; // Mock student ID

    useEffect(() => {
        // Only show published tests
        setTests(mcqStore.getTests().filter(t => t.isPublished));
        setSubmissions(mcqStore.getStudentSubmissions(studentId));
    }, []);

    const getSubmission = (testId: string) => submissions.find(s => s.testId === testId);

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
                {tests.map((test, index) => {
                    const submission = getSubmission(test.id);
                    const totalMarks = test.questions.reduce((acc, q) => acc + q.marks, 0);

                    return (
                        <motion.div
                            key={test.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className={`glass-card hover:border-primary transition-colors ${submission ? 'border-green-500/30' : ''}`}>
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-start">
                                        <span className="truncate">{test.title}</span>
                                        {submission && (
                                            <Badge variant="secondary" className="bg-green-500/20 text-green-500">
                                                Completed
                                            </Badge>
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
                                        <div>{test.questions.length} Questions</div>
                                    </div>

                                    {submission ? (
                                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium">Your Score</span>
                                                <span className="text-lg font-bold text-primary">{submission.score} / {totalMarks}</span>
                                            </div>
                                            <Button className="w-full" variant="outline" onClick={() => navigate(`/student/tests/${test.id}`)}>
                                                View Report
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button className="w-full mt-4" onClick={() => navigate(`/student/tests/${test.id}`)}>
                                            <Play className="w-4 h-4 mr-2" /> Start Test
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}

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
