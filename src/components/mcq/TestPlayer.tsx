import { useState, useEffect, useCallback } from "react";
import { Test, Question, Submission } from "@/lib/mcq-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TestPlayerProps {
    test: Test;
    studentId: string;
    onComplete: (submission: Omit<Submission, 'id' | 'submittedAt'>) => void;
}

export const TestPlayer = ({ test, studentId, onComplete }: TestPlayerProps) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentQuestion = test.questions[currentQuestionIndex];

    const handleSubmit = useCallback(() => {
        setIsSubmitting(true);

        // Calculate score
        let score = 0;
        test.questions.forEach(q => {
            const selected = answers[q.id];
            if (selected === q.correctOptionIndex) {
                score += q.marks;
            } else if (selected !== undefined && q.negativeMarks) {
                score -= q.negativeMarks;
            }
        });

        const submission = {
            testId: test.id,
            studentId,
            answers,
            score,
            timeTakenSeconds: (test.durationMinutes * 60) - timeLeft
        };

        onComplete(submission);
    }, [answers, onComplete, studentId, test.durationMinutes, test.id, test.questions, timeLeft]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [handleSubmit]);

    const handleOptionSelect = (value: string) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: parseInt(value)
        }));
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const progress = ((Object.keys(answers).length) / test.questions.length) * 100;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-4 rounded-lg border shadow-sm sticky top-4 z-10">
                <div>
                    <h2 className="font-bold text-lg">{test.title}</h2>
                    <p className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {test.questions.length}</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                            <Clock className="w-5 h-5" />
                            {formatTime(timeLeft)}
                        </div>
                        <span className="text-xs text-muted-foreground">Time Remaining</span>
                    </div>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant={Object.keys(answers).length === test.questions.length ? "default" : "secondary"}>
                                Submit Test
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Submit Test?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    You have answered {Object.keys(answers).length} out of {test.questions.length} questions.
                                    Once submitted, you cannot change your answers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <Progress value={progress} className="h-2" />

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    <Card className="glass-card min-h-[400px] flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Question {currentQuestionIndex + 1}</span>
                                <span className="text-sm font-medium text-muted-foreground">{currentQuestion.marks} Marks</span>
                            </div>
                            <CardTitle className="text-xl leading-relaxed pt-2">
                                {currentQuestion.text}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <RadioGroup
                                value={answers[currentQuestion.id]?.toString()}
                                onValueChange={handleOptionSelect}
                                className="space-y-4"
                            >
                                {currentQuestion.options.map((option, index) => (
                                    <div key={index} className={`flex items-center space-x-2 border rounded-lg p-4 transition-colors ${answers[currentQuestion.id] === index ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
                                        <RadioGroupItem value={index.toString()} id={`opt-${index}`} />
                                        <Label htmlFor={`opt-${index}`} className="flex-1 cursor-pointer text-base">
                                            {option}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </Card>
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                >
                    <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                </Button>

                <div className="flex gap-2 overflow-x-auto max-w-[200px] md:max-w-md px-2">
                    {test.questions.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentQuestionIndex(idx)}
                            className={`w-8 h-8 rounded-full text-xs font-medium shrink-0 transition-colors ${currentQuestionIndex === idx
                                    ? 'bg-primary text-primary-foreground'
                                    : answers[test.questions[idx].id] !== undefined
                                        ? 'bg-primary/20 text-primary'
                                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>

                <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(test.questions.length - 1, prev + 1))}
                    disabled={currentQuestionIndex === test.questions.length - 1}
                >
                    Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
};
