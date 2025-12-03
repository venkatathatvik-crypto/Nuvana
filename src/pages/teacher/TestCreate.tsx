import { useNavigate } from "react-router-dom";
import { TestForm } from "@/components/mcq/TestForm";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthContext";
import { createTeacherTest, getGradeSubjectIdBySubjectName, getExamTypeIdByName } from "@/services/academic";

const TestCreate = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();

    const handleSubmit = async (data: any) => {
        if (!profile) {
            toast.error("Please login to create tests");
            return;
        }

        try {
            // Convert subject name to grade_subject_id
            const gradeSubjectId = await getGradeSubjectIdBySubjectName(data.classId, data.subject);
            if (!gradeSubjectId) {
                toast.error("Failed to find subject. Please try again.");
                return;
            }

            // Convert exam type name to exam_type_id
            const examTypeId = await getExamTypeIdByName(data.examType);
            if (!examTypeId) {
                toast.error("Failed to find exam type. Please try again.");
                return;
            }

            // Transform questions to match service format
            const questions = data.questions.map((q: any) => ({
                text: q.text,
                options: q.options,
                correctOptionIndex: q.correctOptionIndex,
                marks: q.marks,
                chapter: q.chapter,
                topic: q.topic,
            }));

            await createTeacherTest({
                title: data.title,
                description: data.description,
                durationMinutes: data.durationMinutes,
                isPublished: data.isPublished,
                classId: data.classId,
                gradeSubjectId,
                examTypeId,
                teacherId: profile.id,
                questions,
            });

            toast.success("Test created successfully");
            navigate("/teacher/tests");
        } catch (error: any) {
            console.error("Error creating test:", error);
            toast.error(error.message || "Failed to create test");
        }
    };

    return (
        <div className="min-h-screen p-6 space-y-8">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <Button variant="ghost" onClick={() => navigate("/teacher/tests")} className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tests
                </Button>
                <h1 className="text-4xl font-bold neon-text mb-2">Create New Test</h1>
                <p className="text-muted-foreground mb-8">Design your assessment</p>

                <TestForm onSubmit={handleSubmit} />
            </motion.div>
        </div>
    );
};

export default TestCreate;
