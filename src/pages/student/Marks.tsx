import { motion } from "framer-motion";
import { ArrowLeft, Award, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Marks = () => {
  const navigate = useNavigate();

  const overallPerformance = {
    average: 82,
    totalMarks: 492,
    maxMarks: 600,
    rank: 5,
    totalStudents: 45,
  };

  const subjects = [
    {
      name: "Mathematics",
      midterm: { scored: 85, total: 100, grade: "A" },
      finals: { scored: 88, total: 100, grade: "A" },
      internal: { scored: 42, total: 50, grade: "A" },
      average: 86.5,
      trend: "up",
      tests: [
        { name: "Unit Test 1", marks: 45, total: 50, date: "2024-09-15" },
        { name: "Unit Test 2", marks: 48, total: 50, date: "2024-10-10" },
        { name: "Mid Term", marks: 85, total: 100, date: "2024-10-25" },
      ]
    },
    {
      name: "Physics",
      midterm: { scored: 78, total: 100, grade: "B+" },
      finals: { scored: 82, total: 100, grade: "A" },
      internal: { scored: 38, total: 50, grade: "B+" },
      average: 79.5,
      trend: "up",
      tests: [
        { name: "Unit Test 1", marks: 40, total: 50, date: "2024-09-16" },
        { name: "Unit Test 2", marks: 42, total: 50, date: "2024-10-11" },
        { name: "Mid Term", marks: 78, total: 100, date: "2024-10-26" },
      ]
    },
    {
      name: "Chemistry",
      midterm: { scored: 92, total: 100, grade: "A+" },
      finals: { scored: 90, total: 100, grade: "A+" },
      internal: { scored: 46, total: 50, grade: "A+" },
      average: 91.0,
      trend: "up",
      tests: [
        { name: "Unit Test 1", marks: 48, total: 50, date: "2024-09-17" },
        { name: "Unit Test 2", marks: 47, total: 50, date: "2024-10-12" },
        { name: "Mid Term", marks: 92, total: 100, date: "2024-10-27" },
      ]
    },
    {
      name: "Computer Science",
      midterm: { scored: 88, total: 100, grade: "A" },
      finals: { scored: 85, total: 100, grade: "A" },
      internal: { scored: 44, total: 50, grade: "A" },
      average: 86.5,
      trend: "down",
      tests: [
        { name: "Unit Test 1", marks: 46, total: 50, date: "2024-09-18" },
        { name: "Unit Test 2", marks: 45, total: 50, date: "2024-10-13" },
        { name: "Mid Term", marks: 88, total: 100, date: "2024-10-28" },
      ]
    },
    {
      name: "English",
      midterm: { scored: 75, total: 100, grade: "B+" },
      finals: { scored: 78, total: 100, grade: "B+" },
      internal: { scored: 36, total: 50, grade: "B" },
      average: 75.5,
      trend: "up",
      tests: [
        { name: "Unit Test 1", marks: 38, total: 50, date: "2024-09-19" },
        { name: "Unit Test 2", marks: 40, total: 50, date: "2024-10-14" },
        { name: "Mid Term", marks: 75, total: 100, date: "2024-10-29" },
      ]
    },
  ];

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-neon-cyan";
    if (grade.startsWith("B")) return "text-neon-purple";
    return "text-neon-pink";
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/student")}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold neon-text">Marks & Performance</h1>
            <p className="text-muted-foreground">Track your academic progress</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Award className="w-12 h-12 text-primary mx-auto mb-2 neon-glow" />
                <p className="text-5xl font-bold neon-text">{overallPerformance.average}%</p>
                <p className="text-sm text-muted-foreground mt-2">Overall Average</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{overallPerformance.totalMarks}/{overallPerformance.maxMarks}</p>
                <p className="text-sm text-muted-foreground mt-2">Total Marks Scored</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-secondary">Rank #{overallPerformance.rank}</p>
                <p className="text-sm text-muted-foreground mt-2">Out of {overallPerformance.totalStudents} students</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Subject-wise Performance</h2>
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="glass-card p-6 hover:neon-glow transition-all">
                <Tabs defaultValue="overview" className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-semibold">{subject.name}</h3>
                      {subject.trend === "up" ? (
                        <TrendingUp className="w-5 h-5 text-neon-cyan" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    <p className="text-3xl font-bold text-primary">{subject.average}%</p>
                  </div>

                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="tests">All Tests</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50 border border-border">
                        <p className="text-sm text-muted-foreground mb-2">Mid Term</p>
                        <p className="text-2xl font-bold">{subject.midterm.scored}/{subject.midterm.total}</p>
                        <p className={`text-lg font-semibold ${getGradeColor(subject.midterm.grade)}`}>
                          Grade: {subject.midterm.grade}
                        </p>
                        <Progress value={(subject.midterm.scored / subject.midterm.total) * 100} className="mt-2" />
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50 border border-border">
                        <p className="text-sm text-muted-foreground mb-2">Finals</p>
                        <p className="text-2xl font-bold">{subject.finals.scored}/{subject.finals.total}</p>
                        <p className={`text-lg font-semibold ${getGradeColor(subject.finals.grade)}`}>
                          Grade: {subject.finals.grade}
                        </p>
                        <Progress value={(subject.finals.scored / subject.finals.total) * 100} className="mt-2" />
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50 border border-border">
                        <p className="text-sm text-muted-foreground mb-2">Internal</p>
                        <p className="text-2xl font-bold">{subject.internal.scored}/{subject.internal.total}</p>
                        <p className={`text-lg font-semibold ${getGradeColor(subject.internal.grade)}`}>
                          Grade: {subject.internal.grade}
                        </p>
                        <Progress value={(subject.internal.scored / subject.internal.total) * 100} className="mt-2" />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="tests" className="space-y-3 mt-4">
                    {subject.tests.map((test, idx) => (
                      <div key={idx} className="p-4 rounded-lg bg-muted/50 border border-border flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{test.name}</p>
                          <p className="text-xs text-muted-foreground">{test.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{test.marks}/{test.total}</p>
                          <Progress value={(test.marks / test.total) * 100} className="w-24 mt-1" />
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marks;
