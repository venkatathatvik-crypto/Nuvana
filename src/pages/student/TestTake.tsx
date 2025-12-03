import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TestPlayer } from "@/components/mcq/TestPlayer";
import { mcqStore, Test, Submission } from "@/lib/mcq-store";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const TestTake = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState<Test | undefined>(undefined);
    const [submission, setSubmission] = useState<Submission | undefined>(undefined);
    const studentId = "student-1"; // Mock student ID

    useEffect(() => {
        if (id) {
            const foundTest = mcqStore.getTest(id);
            if (foundTest) {
                setTest(foundTest);
                // Check if already submitted
                const subs = mcqStore.getStudentSubmissions(studentId);
                const existingSub = subs.find(s => s.testId === id);
                if (existingSub) {
                    setSubmission(existingSub);
                }
            } else {
                toast.error("Test not found");
                navigate("/student/tests");
            }
        }
    }, [id, navigate]);

    const handleComplete = (subData: Omit<Submission, 'id' | 'submittedAt'>) => {
        try {
            const newSub = mcqStore.submitTest(subData);
            setSubmission(newSub);
            toast.success("Test submitted successfully!");
        } catch (error) {
            toast.error("Failed to submit test");
        }
    };

    if (!test) return <div>Loading...</div>;

    if (submission) {
        const totalMarks = test.questions.reduce((acc, q) => acc + q.marks, 0);
        const percentage = Math.round((submission.score / totalMarks) * 100);

        return (
            <div className="min-h-screen p-6 space-y-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-4xl mx-auto"
                >
                    <Button variant="ghost" onClick={() => navigate("/student/tests")} className="mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tests
                    </Button>

                    <Card className="glass-card mb-8">
                        <CardHeader className="text-center pb-2">
                            <CardTitle className="text-3xl neon-text">Test Results</CardTitle>
                            <p className="text-muted-foreground">{test.title}</p>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="flex flex-col items-center justify-center py-8">
                                <div className="relative w-40 h-40 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            stroke="currentColor"
                                            strokeWidth="10"
                                            fill="transparent"
                                            className="text-muted/20"
                                        />
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            stroke="currentColor"
                                            strokeWidth="10"
                                            fill="transparent"
                                            strokeDasharray={440}
                                            strokeDashoffset={440 - (440 * percentage) / 100}
                                            className={`text-primary transition-all duration-1000 ease-out ${percentage >= 50 ? 'text-green-500' : 'text-red-500'}`}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-bold">{percentage}%</span>
                                        <span className="text-sm text-muted-foreground">{submission.score} / {totalMarks}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <div className="p-4 rounded-lg bg-muted/30 border">
                                    <p className="text-sm text-muted-foreground">Time Taken</p>
                                    <p className="text-xl font-bold flex items-center justify-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {Math.floor(submission.timeTakenSeconds / 60)}m {submission.timeTakenSeconds % 60}s
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/30 border">
                                    <p className="text-sm text-muted-foreground">Correct Answers</p>
                                    <p className="text-xl font-bold text-green-500">
                                        {test.questions.filter(q => submission.answers[q.id] === q.correctOptionIndex).length}
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/30 border">
                                    <p className="text-sm text-muted-foreground">Incorrect/Skipped</p>
                                    <p className="text-xl font-bold text-red-500">
                                        {test.questions.length - test.questions.filter(q => submission.answers[q.id] === q.correctOptionIndex).length}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 mt-8">
                                <h3 className="text-xl font-bold">Detailed Analysis</h3>
                                {test.questions.map((q, idx) => {
                                    const userAnswer = submission.answers[q.id];
                                    const isCorrect = userAnswer === q.correctOptionIndex;
                                    const isSkipped = userAnswer === undefined;

                                    return (
                                        <div key={q.id} className={`p-4 rounded-lg border ${isCorrect ? 'border-green-500/30 bg-green-500/5' : isSkipped ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                                            <div className="flex gap-3">
                                                <div className="mt-1">
                                                    {isCorrect ? (
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                    ) : isSkipped ? (
                                                        <Clock className="w-5 h-5 text-yellow-500" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-red-500" />
                                                    )}
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <p className="font-medium">Q{idx + 1}. {q.text}</p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                        <div className={`p-2 rounded ${isCorrect ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                                            Your Answer: {userAnswer !== undefined ? q.options[userAnswer] : 'Skipped'}
                                                        </div>
                                                        <div className="p-2 rounded bg-green-500/20 text-green-500">
                                                            Correct Answer: {q.options[q.correctOptionIndex]}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-sm font-bold whitespace-nowrap">
                                                    {isCorrect ? `+${q.marks}` : isSkipped ? '0' : `-${q.negativeMarks || 0}`}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            <TestPlayer test={test} studentId={studentId} onComplete={handleComplete} />
        </div>
    );
};

export default TestTake;
