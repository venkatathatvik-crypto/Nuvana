import { useState } from "react";
import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ScatterChart,
    Scatter,
    ZAxis
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Users, BookOpen, AlertCircle, Clock, CheckCircle } from "lucide-react";

// Mock Data
const performanceTrendData = [
    { month: "Jan", avgScore: 65, attendance: 85 },
    { month: "Feb", avgScore: 68, attendance: 82 },
    { month: "Mar", avgScore: 75, attendance: 88 },
    { month: "Apr", avgScore: 72, attendance: 86 },
    { month: "May", avgScore: 82, attendance: 92 },
    { month: "Jun", avgScore: 85, attendance: 90 },
];

const attendanceVsMarksData = [
    { attendance: 65, marks: 55, student: "S1" },
    { attendance: 70, marks: 62, student: "S2" },
    { attendance: 75, marks: 68, student: "S3" },
    { attendance: 80, marks: 75, student: "S4" },
    { attendance: 85, marks: 82, student: "S5" },
    { attendance: 90, marks: 88, student: "S6" },
    { attendance: 92, marks: 95, student: "S7" },
    { attendance: 95, marks: 92, student: "S8" },
    { attendance: 60, marks: 45, student: "S9" },
    { attendance: 98, marks: 98, student: "S10" },
];

const subjectPerformanceData = [
    { subject: "Math", A: 120, B: 110, fullMark: 150 },
    { subject: "Physics", A: 98, B: 130, fullMark: 150 },
    { subject: "Chemistry", A: 86, B: 130, fullMark: 150 },
    { subject: "Biology", A: 99, B: 100, fullMark: 150 },
    { subject: "English", A: 85, B: 90, fullMark: 150 },
    { subject: "History", A: 65, B: 85, fullMark: 150 },
];

const questionAnalysisData = [
    { question: "Q1", correct: 85, incorrect: 15 },
    { question: "Q2", correct: 60, incorrect: 40 },
    { question: "Q3", correct: 45, incorrect: 55 },
    { question: "Q4", correct: 90, incorrect: 10 },
    { question: "Q5", correct: 30, incorrect: 70 },
];

const difficultyData = [
    { name: "Easy", value: 30 },
    { name: "Medium", value: 50 },
    { name: "Hard", value: 20 },
];

const studentsList = [
    { id: "S1", name: "Alice Johnson" },
    { id: "S2", name: "Bob Smith" },
    { id: "S3", name: "Charlie Brown" },
];

const studentAnalyticsData: Record<string, any> = {
    "S1": {
        radar: [
            { subject: "Math", A: 140, B: 110, fullMark: 150 },
            { subject: "Physics", A: 130, B: 130, fullMark: 150 },
            { subject: "Chemistry", A: 120, B: 130, fullMark: 150 },
            { subject: "Biology", A: 110, B: 100, fullMark: 150 },
            { subject: "English", A: 100, B: 90, fullMark: 150 },
            { subject: "History", A: 90, B: 85, fullMark: 150 },
        ],
        strengths: [
            { subject: "Mathematics", desc: "Consistently scores above 90%" },
            { subject: "Physics", desc: "Strong conceptual understanding" }
        ],
        weaknesses: [
            { subject: "History", desc: "Struggles with dates and events" }
        ]
    },
    "S2": {
        radar: [
            { subject: "Math", A: 90, B: 110, fullMark: 150 },
            { subject: "Physics", A: 85, B: 130, fullMark: 150 },
            { subject: "Chemistry", A: 95, B: 130, fullMark: 150 },
            { subject: "Biology", A: 130, B: 100, fullMark: 150 },
            { subject: "English", A: 120, B: 90, fullMark: 150 },
            { subject: "History", A: 110, B: 85, fullMark: 150 },
        ],
        strengths: [
            { subject: "Biology", desc: "Excellent diagrammatic skills" },
            { subject: "English", desc: "Strong vocabulary and grammar" }
        ],
        weaknesses: [
            { subject: "Physics", desc: "Needs improvement in numericals" }
        ]
    },
    "S3": {
        radar: [
            { subject: "Math", A: 110, B: 110, fullMark: 150 },
            { subject: "Physics", A: 100, B: 130, fullMark: 150 },
            { subject: "Chemistry", A: 105, B: 130, fullMark: 150 },
            { subject: "Biology", A: 95, B: 100, fullMark: 150 },
            { subject: "English", A: 115, B: 90, fullMark: 150 },
            { subject: "History", A: 125, B: 85, fullMark: 150 },
        ],
        strengths: [
            { subject: "History", desc: "Great retention of facts" },
            { subject: "Math", desc: "Good at algebra" }
        ],
        weaknesses: [
            { subject: "Biology", desc: "Struggles with terminology" }
        ]
    }
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const NEON_COLORS = {
    primary: "#8884d8",
    secondary: "#82ca9d",
    accent: "#ffc658",
    danger: "#ff7373"
};

const AnalyticsDashboard = () => {
    const [selectedClass, setSelectedClass] = useState("Class 10A");
    const [selectedStudent, setSelectedStudent] = useState("S1");

    return (
        <div className="min-h-screen p-6 bg-background space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center"
            >
                <div>
                    <h1 className="text-4xl font-bold neon-text mb-2">Analytics Dashboard 📊</h1>
                    <p className="text-muted-foreground">Deep insights into student performance</p>
                </div>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Class 10A">Class 10A</SelectItem>
                        <SelectItem value="Class 10B">Class 10B</SelectItem>
                        <SelectItem value="Class 11A">Class 11A</SelectItem>
                    </SelectContent>
                </Select>
            </motion.div>

            <Tabs defaultValue="class" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="class">Class Insights</TabsTrigger>
                    <TabsTrigger value="student">Student Analysis</TabsTrigger>
                    <TabsTrigger value="test">Test Metrics</TabsTrigger>
                </TabsList>

                {/* Class Level Analytics */}
                <TabsContent value="class" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="glass-card">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Class Average</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-neon-purple">78.5%</div>
                                <p className="text-xs text-green-500 flex items-center mt-1">
                                    <TrendingUp className="w-3 h-3 mr-1" /> +2.5% from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="glass-card">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Attendance Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-neon-cyan">92%</div>
                                <p className="text-xs text-muted-foreground mt-1">Consistent</p>
                            </CardContent>
                        </Card>
                        <Card className="glass-card">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Top Performer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-neon-pink">Alice S.</div>
                                <p className="text-xs text-muted-foreground mt-1">98.5% Avg Score</p>
                            </CardContent>
                        </Card>
                        <Card className="glass-card">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Needs Attention</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-500">3 Students</div>
                                <p className="text-xs text-muted-foreground mt-1">Below 60% Avg</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="glass-card h-[400px]">
                                <CardHeader>
                                    <CardTitle>Performance Trends</CardTitle>
                                    <CardDescription>Average score vs Attendance over time</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[320px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={performanceTrendData}>
                                            <defs>
                                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={NEON_COLORS.primary} stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor={NEON_COLORS.primary} stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={NEON_COLORS.secondary} stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor={NEON_COLORS.secondary} stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                            <XAxis dataKey="month" stroke="#888" />
                                            <YAxis stroke="#888" />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Legend />
                                            <Area type="monotone" dataKey="avgScore" stroke={NEON_COLORS.primary} fillOpacity={1} fill="url(#colorScore)" name="Avg Score" />
                                            <Area type="monotone" dataKey="attendance" stroke={NEON_COLORS.secondary} fillOpacity={1} fill="url(#colorAtt)" name="Attendance" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="glass-card h-[400px]">
                                <CardHeader>
                                    <CardTitle>Attendance vs Marks Correlation</CardTitle>
                                    <CardDescription>Does attendance impact performance?</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[320px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ScatterChart>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                            <XAxis type="number" dataKey="attendance" name="Attendance" unit="%" stroke="#888" domain={[50, 100]} />
                                            <YAxis type="number" dataKey="marks" name="Marks" unit="%" stroke="#888" domain={[0, 100]} />
                                            <ZAxis type="category" dataKey="student" name="Student" />
                                            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                                            <Scatter name="Students" data={attendanceVsMarksData} fill={NEON_COLORS.accent} />
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </TabsContent>

                {/* Student Level Analytics */}
                <TabsContent value="student" className="space-y-6">
                    <div className="flex items-center gap-4 bg-secondary/10 p-4 rounded-lg border border-white/5">
                        <Users className="w-5 h-5 text-neon-blue" />
                        <label className="text-sm font-medium">Select Student for Analysis:</label>
                        <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                            <SelectTrigger className="w-[250px] glass">
                                <SelectValue placeholder="Select Student" />
                            </SelectTrigger>
                            <SelectContent>
                                {studentsList.map(student => (
                                    <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="glass-card col-span-1 lg:col-span-2 h-[450px]">
                            <CardHeader>
                                <CardTitle>Subject-wise Performance</CardTitle>
                                <CardDescription>Comparative analysis for {studentsList.find(s => s.id === selectedStudent)?.name}</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[370px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={studentAnalyticsData[selectedStudent].radar}>
                                        <PolarGrid stroke="#444" />
                                        <PolarAngleAxis dataKey="subject" stroke="#888" />
                                        <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#888" />
                                        <Radar name="Class Average" dataKey="B" stroke={NEON_COLORS.secondary} fill={NEON_COLORS.secondary} fillOpacity={0.3} />
                                        <Radar name="Selected Student" dataKey="A" stroke={NEON_COLORS.primary} fill={NEON_COLORS.primary} fillOpacity={0.5} />
                                        <Legend />
                                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="glass-card col-span-1">
                            <CardHeader>
                                <CardTitle>Strength & Weakness</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-medium mb-3 flex items-center text-green-500">
                                        <TrendingUp className="w-4 h-4 mr-2" /> Strengths
                                    </h4>
                                    <div className="space-y-2">
                                        {studentAnalyticsData[selectedStudent].strengths.map((item: any, idx: number) => (
                                            <div key={idx} className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                                                <p className="font-medium">{item.subject}</p>
                                                <p className="text-xs text-muted-foreground">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium mb-3 flex items-center text-red-500">
                                        <AlertCircle className="w-4 h-4 mr-2" /> Weaknesses
                                    </h4>
                                    <div className="space-y-2">
                                        {studentAnalyticsData[selectedStudent].weaknesses.map((item: any, idx: number) => (
                                            <div key={idx} className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                                <p className="font-medium">{item.subject}</p>
                                                <p className="text-xs text-muted-foreground">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Test Level Analytics */}
                <TabsContent value="test" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="glass-card h-[400px]">
                            <CardHeader>
                                <CardTitle>Question Analysis</CardTitle>
                                <CardDescription>Correct vs Incorrect responses per question</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[320px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={questionAnalysisData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                                        <XAxis type="number" stroke="#888" />
                                        <YAxis dataKey="question" type="category" stroke="#888" />
                                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                                        <Legend />
                                        <Bar dataKey="correct" stackId="a" fill={NEON_COLORS.secondary} name="Correct %" />
                                        <Bar dataKey="incorrect" stackId="a" fill={NEON_COLORS.danger} name="Incorrect %" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="glass-card h-[250px]">
                                <CardHeader>
                                    <CardTitle>Difficulty Distribution</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[180px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={difficultyData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {difficultyData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                                            <Legend verticalAlign="middle" align="right" layout="vertical" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-2 gap-4">
                                <Card className="glass-card p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/20 rounded-full text-blue-500">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Avg Time/Q</p>
                                            <p className="text-lg font-bold">45s</p>
                                        </div>
                                    </div>
                                </Card>
                                <Card className="glass-card p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-500/20 rounded-full text-green-500">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Completion Rate</p>
                                            <p className="text-lg font-bold">98%</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AnalyticsDashboard;
