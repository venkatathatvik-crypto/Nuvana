
const generateId = () => Math.random().toString(36).substr(2, 9);

export interface Question {
    id: string;
    text: string;
    questionType: 'MCQ' | 'Essay' | 'Short Answer' | 'Very Short Answer';
    options?: string[]; // Optional for non-MCQ questions
    correctOptionIndex?: number; // Optional for non-MCQ questions
    marks: number;
    negativeMarks?: number;
    chapter: string;
    topic: string;
}

export interface Test {
    id: string;
    title: string;
    description?: string;
    durationMinutes: number;
    questions: Question[];
    isPublished: boolean;
    createdBy: string;
    createdAt: string;
    scheduledFor?: string;
}

export interface Submission {
    id: string;
    testId: string;
    studentId: string;
    answers: Record<string, number>; // questionId -> selectedOptionIndex
    score: number;
    submittedAt: string;
    timeTakenSeconds: number;
}

const TESTS_KEY = 'aura_mcq_tests';
const SUBMISSIONS_KEY = 'aura_mcq_submissions';

export const mcqStore = {
    // Tests
    getTests: (): Test[] => {
        const data = localStorage.getItem(TESTS_KEY);
        return data ? JSON.parse(data) : [];
    },

    getTest: (id: string): Test | undefined => {
        const tests = mcqStore.getTests();
        return tests.find((t) => t.id === id);
    },

    saveTest: (test: Omit<Test, 'id' | 'createdAt'> & { id?: string }) => {
        const tests = mcqStore.getTests();
        const newTest: Test = {
            ...test,
            id: test.id || generateId(),
            createdAt: test.id ? (tests.find(t => t.id === test.id)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
        };

        const existingIndex = tests.findIndex((t) => t.id === newTest.id);
        if (existingIndex >= 0) {
            tests[existingIndex] = newTest;
        } else {
            tests.push(newTest);
        }

        localStorage.setItem(TESTS_KEY, JSON.stringify(tests));
        return newTest;
    },

    deleteTest: (id: string) => {
        const tests = mcqStore.getTests().filter((t) => t.id !== id);
        localStorage.setItem(TESTS_KEY, JSON.stringify(tests));
    },

    // Submissions
    getSubmissions: (testId?: string): Submission[] => {
        const data = localStorage.getItem(SUBMISSIONS_KEY);
        const submissions: Submission[] = data ? JSON.parse(data) : [];
        if (testId) {
            return submissions.filter((s) => s.testId === testId);
        }
        return submissions;
    },

    submitTest: (submission: Omit<Submission, 'id' | 'submittedAt'>) => {
        const submissions = mcqStore.getSubmissions();
        const newSubmission: Submission = {
            ...submission,
            id: generateId(),
            submittedAt: new Date().toISOString(),
        };
        submissions.push(newSubmission);
        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
        return newSubmission;
    },

    getStudentSubmissions: (studentId: string): Submission[] => {
        const submissions = mcqStore.getSubmissions();
        return submissions.filter(s => s.studentId === studentId);
    }
};
