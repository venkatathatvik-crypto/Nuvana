import { motion } from "framer-motion";
import { ArrowLeft, Upload, Save, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react"; // Added useMemo
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getExamTypes,
  getSubjects,
  getTeacherClasses,
} from "@/services/academic";
import { FlattenedClass } from "@/schemas/academic";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/auth/AuthContext";

// Define StudentMark interface for clarity
interface StudentMark {
  id: number;
  name: string;
  rollNo: string;
  marks: string;
  maxMarks: string;
}

const TeacherMarks = () => {
  const navigate = useNavigate();
  const { profile, profileLoading } = useAuth();

  // --- STATE INITIALIZATION ---
  const [classes, setClasses] = useState<FlattenedClass[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [examTypes, setExamTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // State for selected objects
  const [selectedClass, setSelectedClass] = useState<
    FlattenedClass | undefined
  >(undefined); // Allow undefined/null initially
  const [selectedSubject, setSelectedSubject] = useState("");
  const [examType, setExamType] = useState("");

  // Dummy student data
  const [students, setStudents] = useState<StudentMark[]>([
    { id: 1, name: "John Smith", rollNo: "101", marks: "85", maxMarks: "100" },
    {
      id: 2,
      name: "Emma Johnson",
      rollNo: "102",
      marks: "92",
      maxMarks: "100",
    },
    {
      id: 3,
      name: "Michael Brown",
      rollNo: "103",
      marks: "78",
      maxMarks: "100",
    },
    {
      id: 4,
      name: "Sophia Davis",
      rollNo: "104",
      marks: "88",
      maxMarks: "100",
    },
    {
      id: 5,
      name: "William Wilson",
      rollNo: "105",
      marks: "95",
      maxMarks: "100",
    },
    {
      id: 6,
      name: "Olivia Martinez",
      rollNo: "106",
      marks: "82",
      maxMarks: "100",
    },
    {
      id: 7,
      name: "James Anderson",
      rollNo: "107",
      marks: "90",
      maxMarks: "100",
    },
    {
      id: 8,
      name: "Isabella Taylor",
      rollNo: "108",
      marks: "87",
      maxMarks: "100",
    },
    {
      id: 9,
      name: "Benjamin Thomas",
      rollNo: "109",
      marks: "93",
      maxMarks: "100",
    },
    { id: 10, name: "Mia Garcia", rollNo: "110", marks: "79", maxMarks: "100" },
  ]);

  // --- EFFECT 1: INITIAL DATA LOAD (Classes & Exam Types) ---
  useEffect(() => {
    const fetchInitialData = async () => {
      if (profileLoading) return;

      if (!profile) {
        setClasses([]);
        setSelectedClass(undefined);
        setExamTypes([]);
        setLoading(false);
        return;
      }

      try {
        const [classResponse, examResponse] = await Promise.all([
          getTeacherClasses(profile.id),
          getExamTypes(),
        ]);

        if (classResponse) {
          setClasses(classResponse);

          if (classResponse.length > 0) {
            setSelectedClass(classResponse[0]); // Set the default class object
          } else {
            setSelectedClass(undefined);
          }
        }

        if (examResponse) {
          setExamTypes(examResponse);
          // FIX 1: Set default exam type from fetched data
          if (examResponse.length > 0) {
            setExamType(examResponse[0]);
          } else {
            setExamType("");
          }
        }
      } catch (error) {
        toast.error("Failed to load core academic data.");
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [profile, profileLoading]);

  // --- EFFECT 2: DYNAMIC SUBJECT LOAD (DEPENDS ON selectedClass) ---
  useEffect(() => {
    if (selectedClass) {
      const fetchSubjectsByGrade = async () => {
        const gradeId = selectedClass.grade_id;

        try {
          const subjectResponse = await getSubjects(gradeId);
          if (subjectResponse) {
            setSubjects(subjectResponse);
            // FIX 2: Set the default subject based on the new class's curriculum
            if (subjectResponse.length > 0) {
              setSelectedSubject(subjectResponse[0]);
            } else {
              setSelectedSubject(""); // Clear if no subjects found
            }
          }
        } catch (error) {
          console.error(
            `Error fetching subjects for Grade ID ${gradeId}:`,
            error
          );
          setSubjects([]);
          setSelectedSubject("");
        }
      };

      fetchSubjectsByGrade();
    }
  }, [selectedClass]); // Reruns whenever selectedClass object changes

  // --- HANDLERS ---

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = e.target.value;
    const cls = classes.find((c) => c.class_id === classId);

    // This setter triggers useEffect 2, which loads the new subjects
    if (cls) setSelectedClass(cls);
  };

  const updateMarks = (studentId: number, marks: string) => {
    setStudents(
      students.map((student) =>
        student.id === studentId ? { ...student, marks } : student
      )
    );
  };

  const submitMarks = () => {
    if (!selectedClass || !selectedSubject || !examType) {
      toast.error(
        "Please select a valid Class, Subject, and Exam Type before publishing."
      );
      return;
    }
    toast.success(
      `Marks published for ${selectedClass.class_name}, Subject: ${selectedSubject} (${examType})`
    );
  };

  const classAverage = useMemo(() => {
    if (students.length === 0) return "0.0";
    return (
      students.reduce((acc, s) => acc + parseFloat(s.marks || "0"), 0) /
      students.length
    ).toFixed(1);
  }, [students]);

  // --- LOADING AND GUARD CLAUSES ---
  if (loading) {
    return <LoadingSpinner />;
  }

  // Check if classes were loaded but no class was selected (should only happen if classes are empty)
  if (!selectedClass) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center text-xl font-semibold text-destructive">
        No classes available or assigned.
      </div>
    );
  }

  // --- JSX RENDERING ---
  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header/Navigation */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/teacher")}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold neon-text">Upload Marks</h1>
            <p className="text-muted-foreground">
              Enter and publish student marks
            </p>
          </motion.div>
        </div>

        <Tabs defaultValue="manual" className="w-full">
          {/* Tabs List (Manual/Bulk) */}
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-card p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Class Dropdown */}
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Class
                    </label>
                    <select
                      className="w-full p-3 rounded-lg bg-muted border border-border"
                      value={selectedClass.class_id} // Uses the selected Class object's ID
                      onChange={handleClassChange} // Uses the helper handler
                    >
                      {classes.map((cls) => (
                        <option key={cls.class_id} value={cls.class_id}>
                          {cls.class_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Subject Dropdown */}
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Subject
                    </label>
                    <select
                      className="w-full p-3 rounded-lg bg-muted border border-border"
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      disabled={subjects.length === 0}
                    >
                      {subjects.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                      {subjects.length === 0 && (
                        <option disabled>No subjects</option>
                      )}
                    </select>
                  </div>
                  {/* Exam Type Dropdown */}
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Exam Type
                    </label>
                    <select
                      className="w-full p-3 rounded-lg bg-muted border border-border"
                      value={examType}
                      onChange={(e) => setExamType(e.target.value)}
                    >
                      {examTypes.map((type) => (
                        // Assuming examTypes returns simple strings
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Class Average */}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Class Average
                    </p>
                    <p className="text-4xl font-bold text-primary">
                      {classAverage}%
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card p-6">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Award className="w-6 h-6 text-primary" />
                  Enter Marks - {selectedClass.class_name}
                </h2>

                <div className="space-y-3">
                  {students.map((student, index) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.03 }}
                      className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary transition-all"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                            {student.rollNo}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{student.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Roll No: {student.rollNo}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={student.marks}
                              onChange={(e) =>
                                updateMarks(student.id, e.target.value)
                              }
                              className="w-24 text-center text-lg font-bold"
                              placeholder="0"
                            />
                            <span className="text-muted-foreground">
                              / {student.maxMarks}
                            </span>
                          </div>
                          <div className="text-right min-w-[60px]">
                            <p className="text-xl font-bold text-primary">
                              {(
                                (parseFloat(student.marks || "0") /
                                  parseFloat(student.maxMarks)) *
                                100
                              ).toFixed(0)}
                              %
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" className="glass">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button
                size="lg"
                className="neon-glow px-8"
                onClick={submitMarks}
              >
                Publish Marks
              </Button>
            </div>
          </TabsContent>

          {/* Bulk Upload Content (Unchanged) */}
          <TabsContent value="bulk" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="glass-card p-8 text-center">
                <Upload className="w-16 h-16 text-primary mx-auto mb-4 neon-glow" />
                <h3 className="text-2xl font-semibold mb-2">Upload CSV File</h3>
                <p className="text-muted-foreground mb-6">
                  Upload a CSV file with columns: Roll No, Name, Marks
                </p>
                <div className="flex flex-col items-center gap-4">
                  <Button className="neon-glow">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                  <Button variant="outline" className="glass">
                    Download Template
                  </Button>
                </div>
              </Card>
            </motion.div>

            <Card className="glass-card p-6 bg-primary/5 border-primary/30">
              <h3 className="font-semibold mb-2">📝 CSV Format Instructions</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • First row should contain headers: Roll No, Name, Marks
                </li>
                <li>• Each row represents one student</li>
                <li>• Marks should be numeric values</li>
                <li>• Save the file in CSV format before uploading</li>
              </ul>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherMarks;
