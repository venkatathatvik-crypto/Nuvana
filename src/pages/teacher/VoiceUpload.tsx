import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Upload, Play, Pause, Save, Trash2, Clock, FileAudio } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getClasses, getSubjects, FlattenedClass } from "@/services/academic";

const VoiceUpload = () => {
    const navigate = useNavigate();
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Dropdown states
    const [classes, setClasses] = useState<FlattenedClass[]>([]);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>("");
    const [selectedSubject, setSelectedSubject] = useState<string>("");

    // Mock data for existing recordings
    const [recordings, setRecordings] = useState([
        { id: 1, title: "Math Class - Algebra Intro", date: "2024-12-01", duration: "45:20", size: "15MB", class: "Class 10A" },
        { id: 2, title: "Physics - Newton's Laws", date: "2024-11-28", duration: "30:15", size: "10MB", class: "Class 11B" },
    ]);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch classes on mount
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const data = await getClasses();
                setClasses(data || []);
            } catch (error) {
                console.error("Failed to fetch classes", error);
                toast.error("Failed to load classes");
            }
        };
        fetchClasses();
    }, []);

    // Fetch subjects when class changes
    useEffect(() => {
        const fetchSubjectsForClass = async () => {
            if (!selectedClassId) {
                setSubjects([]);
                setSelectedSubject("");
                return;
            }
            const selectedClass = classes.find(c => c.class_id === selectedClassId);
            if (selectedClass) {
                try {
                    const data = await getSubjects(selectedClass.grade_id);
                    setSubjects(data || []);
                } catch (error) {
                    console.error("Failed to fetch subjects", error);
                    toast.error("Failed to load subjects");
                }
            }
        };
        fetchSubjectsForClass();
    }, [selectedClassId, classes]);

    const startRecording = () => {
        if (!selectedClassId || !selectedSubject) {
            toast.error("Please select a class and subject first");
            return;
        }
        setIsRecording(true);
        setRecordingTime(0);
        timerRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
        toast.info("Recording started...");
    };

    const stopRecording = () => {
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        // Simulate creating a blob
        setAudioBlob(new Blob(["mock audio data"], { type: "audio/mp3" }));
        toast.success("Recording saved locally. Ready to upload.");
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleUpload = () => {
        if (!audioBlob) return;

        const selectedClassName = classes.find(c => c.class_id === selectedClassId)?.class_name || "Unknown Class";

        // Mock upload
        const newRecording = {
            id: recordings.length + 1,
            title: `${selectedSubject} - Recording ${new Date().toLocaleTimeString()}`,
            date: new Date().toISOString().split('T')[0],
            duration: formatTime(recordingTime),
            size: "5MB",
            class: selectedClassName
        };

        setRecordings([newRecording, ...recordings]);
        setAudioBlob(null);
        setRecordingTime(0);
        toast.success("Voice note uploaded successfully!");
    };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-4xl font-bold neon-text mb-2">Voice Notes 🎙️</h1>
                        <p className="text-muted-foreground">Record and upload class sessions</p>
                    </div>
                    <Button variant="outline" className="glass" onClick={() => navigate("/teacher")}>
                        Back to Dashboard
                    </Button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recording Interface */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1"
                    >
                        <Card className="glass-card p-6 h-full flex flex-col justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold mb-6">New Recording</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Class</label>
                                        <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Class" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {classes.map((cls) => (
                                                    <SelectItem key={cls.class_id} value={cls.class_id}>
                                                        {cls.class_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Subject</label>
                                        <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedClassId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Subject" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {subjects.map((subject) => (
                                                    <SelectItem key={subject} value={subject}>
                                                        {subject}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-2xl bg-secondary/10 mb-6">
                                    <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${isRecording ? 'bg-red-500/20 animate-pulse' : 'bg-primary/20'}`}>
                                        <Mic className={`w-16 h-16 ${isRecording ? 'text-red-500' : 'text-primary'}`} />
                                    </div>
                                    <div className="text-4xl font-mono font-bold mb-2">
                                        {formatTime(recordingTime)}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {isRecording ? "Recording in progress..." : "Ready to record"}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {!isRecording && !audioBlob && (
                                        <Button className="w-full h-12 text-lg" onClick={startRecording}>
                                            <Mic className="mr-2 w-5 h-5" /> Start Recording
                                        </Button>
                                    )}

                                    {isRecording && (
                                        <Button variant="destructive" className="w-full h-12 text-lg" onClick={stopRecording}>
                                            <Square className="mr-2 w-5 h-5 fill-current" /> Stop Recording
                                        </Button>
                                    )}

                                    {audioBlob && (
                                        <div className="space-y-3">
                                            <div className="flex gap-2">
                                                <Button variant="outline" className="flex-1" onClick={() => setIsPlaying(!isPlaying)}>
                                                    {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                                                    {isPlaying ? "Pause" : "Preview"}
                                                </Button>
                                                <Button variant="destructive" size="icon" onClick={() => { setAudioBlob(null); setRecordingTime(0); }}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <Button className="w-full h-12 text-lg neon-glow" onClick={handleUpload}>
                                                <Upload className="mr-2 w-5 h-5" /> Upload Recording
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-border">
                                <p className="text-sm font-medium mb-3">Or upload audio file</p>
                                <div className="flex gap-2">
                                    <Input type="file" accept="audio/*" className="glass" />
                                    <Button variant="secondary">
                                        <Upload className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Recent Recordings List */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <Card className="glass-card p-6 h-full">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold">Recent Recordings</h2>
                                <Badge variant="outline" className="text-primary border-primary/50">
                                    {recordings.length} Files
                                </Badge>
                            </div>

                            <div className="space-y-4">
                                {recordings.map((rec) => (
                                    <motion.div
                                        key={rec.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 rounded-xl bg-secondary/30 border border-white/5 hover:border-primary/30 transition-all group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple">
                                                    <FileAudio className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">{rec.title}</h3>
                                                    <div className="flex gap-3 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" /> {rec.duration}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{rec.date}</span>
                                                        <span>•</span>
                                                        <span>{rec.class}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" className="hover:text-primary">
                                                    <Play className="w-5 h-5" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="hover:text-primary">
                                                    <Upload className="w-5 h-5" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="hover:text-destructive">
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default VoiceUpload;
