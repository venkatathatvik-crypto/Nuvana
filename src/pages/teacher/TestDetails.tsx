import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TestForm } from "@/components/mcq/TestForm";
import { mcqStore, Test, Submission } from "@/lib/mcq-store";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState<Test | undefined>(undefined);
    const [submissions, setSubmissions] = useState<Submission[]>([]);

    useEffect(() => {
        if (id) {
            const foundTest = mcqStore.getTest(id);
            if (foundTest) {
                setTest(foundTest);
                setSubmissions(mcqStore.getSubmissions(id));
            } else {
                toast.error("Test not found");
                navigate("/teacher/tests");
            }
        }
    }, [id, navigate]);

    const handleUpdate = (data: any) => {
        if (!test) return;
        try {
            mcqStore.saveTest({
                ...data,
                id: test.id,
                createdBy: test.createdBy,
                createdAt: test.createdAt,
            });
            toast.success("Test updated successfully");
            setTest(mcqStore.getTest(test.id)); // Refresh
        } catch (error) {
            toast.error("Failed to update test");
        }
    };

    const exportResults = () => {
        if (!submissions.length) return;

        const headers = ["Student ID", "Score", "Total Marks", "Time Taken (s)", "Submitted At"];
        const rows = submissions.map(s => [
            s.studentId,
            s.score,
            test?.questions.reduce((acc, q) => acc + q.marks, 0) || 0,
            s.timeTakenSeconds,
            new Date(s.submittedAt).toLocaleString()
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `results-${test?.title}.csv`;
        a.click();
    };

    if (!test) return <div>Loading...</div>;

    return (
        <div className="min-h-screen p-6 space-y-8">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate("/teacher/tests")}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold neon-text">{test.title}</h1>
                            <p className="text-muted-foreground">Manage test and view results</p>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="edit" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="edit">Edit Test</TabsTrigger>
                        <TabsTrigger value="results">Results & Submissions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="edit">
                        <TestForm initialData={test} onSubmit={handleUpdate} />
                    </TabsContent>

                    <TabsContent value="results">
                        <Card className="glass-card">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Student Submissions ({submissions.length})</CardTitle>
                                <Button variant="outline" onClick={exportResults} disabled={submissions.length === 0}>
                                    <Download className="w-4 h-4 mr-2" /> Export CSV
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student ID</TableHead>
                                            <TableHead>Score</TableHead>
                                            <TableHead>Time Taken</TableHead>
                                            <TableHead>Submitted At</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {submissions.map((submission) => (
                                            <TableRow key={submission.id}>
                                                <TableCell className="font-medium">{submission.studentId}</TableCell>
                                                <TableCell className="text-primary font-bold">
                                                    {submission.score} / {test.questions.reduce((acc, q) => acc + q.marks, 0)}
                                                </TableCell>
                                                <TableCell>{Math.floor(submission.timeTakenSeconds / 60)}m {submission.timeTakenSeconds % 60}s</TableCell>
                                                <TableCell>{new Date(submission.submittedAt).toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                        {submissions.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                    No submissions yet.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    );
};

export default TestDetails;
