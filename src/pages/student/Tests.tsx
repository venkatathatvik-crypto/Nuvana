import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, CheckCircle, Clock, Calendar, Award, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

    // Categorize tests
    const upcomingTests = tests.filter(test => !getSubmission(test.id));
    const activeTests = tests.filter(test => !getSubmission(test.id));
    const completedTests = tests.filter(test => getSubmission(test.id));

    const renderTestCard = (test: Test, index: number, showStartButton: boolean = true) => {
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
                        <CardDescription>
                            {test.description || "No description provided."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {test.durationMinutes} mins
                            </div>
                            <div className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                {test.questions.length} Questions
                            </div>
                            <div className="flex items-center gap-1">
                                <Award className="w-4 h-4" />
                                {totalMarks} Marks
                            </div>
                        </div>

                        {submission ? (
                            <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-green-500/20">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-medium">Your Score</span>
                                    <span className="text-2xl font-bold text-green-500">
                                        {submission.score} / {totalMarks}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm text-muted-foreground">Percentage</span>
                                    <span className="text-lg font-semibold">
                                        {((submission.score / totalMarks) * 100).toFixed(1)}%
                                    </span>
                                </div>
                                <Button
                                    className="w-full"
                                    variant="outline"
                                    onClick={() => navigate(`/student/tests/take/${test.id}`)}
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    View Detailed Report
                                </Button>
                            </div>
                        ) : showStartButton ? (
                            <Button
                                className="w-full mt-4"
                                onClick={() => navigate(`/student/tests/take/${test.id}`)}
                            >
                                <Play className="w-4 h-4 mr-2" /> Start Test
                            </Button>
                        ) : (
                            <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 text-center">
                                <Calendar className="w-5 h-5 mx-auto mb-2 text-blue-500" />
                                <p className="text-sm text-muted-foreground">Available Soon</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen p-6 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-4xl font-bold neon-text mb-2">My Assessments 📝</h1>
                <p className="text-muted-foreground">Take tests and view your progress</p>
            </motion.div>

            <Tabs defaultValue="active" className="space-y-6">
                <TabsList className="grid grid-cols-3 w-full max-w-2xl">
                    <TabsTrigger value="upcoming" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Upcoming ({upcomingTests.length})
                    </TabsTrigger>
                    <TabsTrigger value="active" className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Active ({activeTests.length})
                    </TabsTrigger>
                    <TabsTrigger value="results" className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Results ({completedTests.length})
                    </TabsTrigger>
                </TabsList>

                {/* Upcoming Tests Tab */}
                <TabsContent value="upcoming" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingTests.length > 0 ? (
                            upcomingTests.map((test, index) => renderTestCard(test, index, false))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                                <p className="text-muted-foreground">No upcoming tests scheduled.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* Active Tests Tab */}
                <TabsContent value="active" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeTests.length > 0 ? (
                            activeTests.map((test, index) => renderTestCard(test, index, true))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <Play className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                                <p className="text-muted-foreground">No active tests available to take.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* Results Tab */}
                <TabsContent value="results" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {completedTests.length > 0 ? (
                            completedTests.map((test, index) => renderTestCard(test, index, false))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                                <p className="text-muted-foreground">No completed tests yet. Start taking tests to see your results here!</p>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default StudentTests;
