import { useNavigate } from "react-router-dom";
import { TestForm } from "@/components/mcq/TestForm";
import { mcqStore } from "@/lib/mcq-store";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const TestCreate = () => {
    const navigate = useNavigate();

    const handleSubmit = (data: any) => {
        try {
            mcqStore.saveTest({
                ...data,
                createdBy: "teacher-1", // Mock teacher ID
            });
            toast.success("Test created successfully");
            navigate("/teacher/tests");
        } catch (error) {
            toast.error("Failed to create test");
        }
    };

    return (
        <div className="min-h-screen p-6 bg-background space-y-8">
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
