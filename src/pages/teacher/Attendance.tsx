import { motion } from "framer-motion";
import { ArrowLeft, Users, Check, X, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { getTeacherClasses } from "@/services/academic";
import type { FlattenedClass } from "@/schemas/academic";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/auth/AuthContext";

const TeacherAttendance = () => {
  const navigate = useNavigate();
  const { profile, profileLoading } = useAuth();

  const [classes, setClasses] = useState<FlattenedClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<FlattenedClass | null>(
    null
  );
  const [selectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState([
    { id: 1, name: "John Smith", rollNo: "101", present: true },
    { id: 2, name: "Emma Johnson", rollNo: "102", present: true },
    { id: 3, name: "Michael Brown", rollNo: "103", present: false },
    { id: 4, name: "Sophia Davis", rollNo: "104", present: true },
    { id: 5, name: "William Wilson", rollNo: "105", present: true },
    { id: 6, name: "Olivia Martinez", rollNo: "106", present: false },
    { id: 7, name: "James Anderson", rollNo: "107", present: true },
    { id: 8, name: "Isabella Taylor", rollNo: "108", present: true },
    { id: 9, name: "Benjamin Thomas", rollNo: "109", present: true },
    { id: 10, name: "Mia Garcia", rollNo: "110", present: false },
  ]);

  // Load classes dynamically for the logged-in teacher
  useEffect(() => {
    const fetchClasses = async () => {
      if (profileLoading) return;

      if (!profile) {
        setClasses([]);
        setSelectedClass(null);
        setLoading(false);
        return;
      }

      try {
        const classResponse = await getTeacherClasses(profile.id);
        if (classResponse && classResponse.length > 0) {
          setClasses(classResponse);
          setSelectedClass(classResponse[0]);
        } else {
          setClasses([]);
          setSelectedClass(null);
        }
      } catch (error) {
        console.error("Error fetching classes for attendance:", error);
        toast.error("Failed to load classes for attendance.");
        setClasses([]);
        setSelectedClass(null);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [profile, profileLoading]);

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = e.target.value;
    const cls = classes.find((c) => c.class_id === classId);
    if (cls) {
      setSelectedClass(cls);
    }
  };

  const toggleAttendance = (studentId: number) => {
    setStudents(
      students.map((student) =>
        student.id === studentId
          ? { ...student, present: !student.present }
          : student
      )
    );
  };

  const markAllPresent = () => {
    setStudents(students.map((student) => ({ ...student, present: true })));
    toast.success("Marked all students present");
  };

  const markAllAbsent = () => {
    setStudents(students.map((student) => ({ ...student, present: false })));
    toast.success("Marked all students absent");
  };

  const submitAttendance = () => {
    const presentCount = students.filter((s) => s.present).length;
    toast.success(
      `Attendance submitted! ${presentCount}/${students.length} students present`
    );
  };

  const presentCount = students.filter((s) => s.present).length;
  const attendancePercentage = ((presentCount / students.length) * 100).toFixed(
    1
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!selectedClass) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center text-xl font-semibold text-destructive">
        No classes available or assigned for attendance.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
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
            <h1 className="text-4xl font-bold neon-text">Post Attendance</h1>
            <p className="text-muted-foreground">Mark student attendance</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Select Class
                </label>
                <select
                  className="w-full p-3 rounded-lg bg-muted border border-border"
                  value={selectedClass.class_id}
                  onChange={handleClassChange}
                >
                  {classes.map((cls) => (
                    <option key={cls.class_id} value={cls.class_id}>
                      {cls.class_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Date
                </label>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted border border-border">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>{selectedDate}</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Present Today
                </p>
                <p className="text-4xl font-bold text-neon-cyan">
                  {presentCount}/{students.length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Percentage</p>
                <p className="text-4xl font-bold text-primary">
                  {attendancePercentage}%
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="flex gap-4 justify-end">
          <Button variant="outline" onClick={markAllPresent} className="glass">
            <Check className="w-4 h-4 mr-2" />
            Mark All Present
          </Button>
          <Button variant="outline" onClick={markAllAbsent} className="glass">
            <X className="w-4 h-4 mr-2" />
            Mark All Absent
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Students - {selectedClass.class_name}
            </h2>

            <div className="space-y-3">
              {students.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.03 }}
                  className={`p-4 rounded-lg border transition-all ${
                    student.present
                      ? "bg-neon-cyan/10 border-neon-cyan/30"
                      : "bg-destructive/10 border-destructive/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                          student.present
                            ? "bg-neon-cyan/20 text-neon-cyan"
                            : "bg-destructive/20 text-destructive"
                        }`}
                      >
                        {student.rollNo}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {student.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Roll No: {student.rollNo}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-sm font-medium ${
                          student.present
                            ? "text-neon-cyan"
                            : "text-destructive"
                        }`}
                      >
                        {student.present ? "Present" : "Absent"}
                      </span>
                      <Checkbox
                        checked={student.present}
                        onCheckedChange={() => toggleAttendance(student.id)}
                        className="h-6 w-6"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        <div className="flex justify-end">
          <Button
            size="lg"
            className="neon-glow px-8"
            onClick={submitAttendance}
          >
            Submit Attendance
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;
