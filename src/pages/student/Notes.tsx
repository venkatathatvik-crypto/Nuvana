import { motion } from "framer-motion";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useAuth } from "@/auth/AuthContext";
import { getStudentData, getStudentFiles, incrementFileDownload } from "@/services/academic";
import LoadingSpinner from "@/components/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const Notes = () => {
  const navigate = useNavigate();
  const { profile, profileLoading } = useAuth();
  const [files, setFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [studentClassId, setStudentClassId] = useState<string | null>(null);

<<<<<<< HEAD
  const [notes] = useState([
    {
      id: 1,
      title: "Mathematics - Calculus Tips",
      content: "Remember: derivative of sin(x) is cos(x), derivative of cos(x) is -sin(x)",
      subject: "Mathematics",
      color: "neon-cyan",
      date: "2024-11-28",
    },
    {
      id: 2,
      title: "Physics - Newton's Laws",
      content: "F = ma. Remember to always identify all forces acting on the body before solving.",
      subject: "Physics",
      color: "neon-purple",
      date: "2024-11-27",
    },
    {
      id: 3,
      title: "Chemistry - Organic Reactions",
      content: "Markovnikov's rule: In addition reactions, H goes to the carbon with more H atoms",
      subject: "Chemistry",
      color: "neon-pink",
      date: "2024-11-26",
    },
    {
      id: 4,
      title: "Assignment Due",
      content: "Complete Computer Science project by Friday. Need to finish the database design.",
      subject: "Computer Science",
      color: "blue-500",
      date: "2024-11-25",
    },
    {
      id: 5,
      title: "English Essay Points",
      content: "Essay structure: Introduction (hook + thesis) → 3 body paragraphs → Conclusion",
      subject: "English",
      color: "text-accent",
      date: "2024-11-24",
    },
    {
      id: 6,
      title: "Study Group Meeting",
      content: "Physics study group tomorrow at 4 PM in library. Bring doubts from Chapter 5.",
      subject: "General",
      color: "text-primary",
      date: "2024-11-23",
    },
  ]);
=======
  useEffect(() => {
    const fetchStudentFiles = async () => {
      if (profileLoading) return;

      if (!profile) {
        setLoadingFiles(false);
        return;
      }

      try {
        // Get student data to get class_id
        const studentData = await getStudentData(profile.id);
        if (studentData && studentData.class_id) {
          setStudentClassId(studentData.class_id);
          // Fetch files for this class
          const filesData = await getStudentFiles(studentData.class_id);
          setFiles(filesData);
        }
      } catch (error) {
        console.error("Error fetching student files:", error);
        toast.error("Failed to load files.");
      } finally {
        setLoadingFiles(false);
      }
    };

    fetchStudentFiles();
  }, [profile, profileLoading]);

  const handleDownload = async (file: any) => {
    try {
      // Increment download count
      await incrementFileDownload(file.id);
      
      // Open file in new tab
      window.open(file.storageUrl, "_blank");
      
      // Update local state
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === file.id ? { ...f, downloads: f.downloads + 1 } : f
        )
      );
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file.");
    }
  };
>>>>>>> 702fe63626baee98b89d9f63aa98f91fb093c1c6

  const subjectColors: Record<string, string> = {
    Mathematics: "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30",
    Physics: "bg-neon-purple/20 text-neon-purple border-neon-purple/30",
    Chemistry: "bg-neon-pink/20 text-neon-pink border-neon-pink/30",
    "Computer Science": "bg-blue-500/20 text-blue-500 border-blue-500/30",
    English: "bg-accent/20 text-accent border-accent/30",
    General: "bg-primary/20 text-primary border-primary/30",
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/student")}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl font-bold neon-text">Class Files</h1>
              <p className="text-muted-foreground">Files uploaded by your teachers</p>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">{files.length}</p>
                <p className="text-sm text-muted-foreground">Total Files</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-secondary">
                  {new Set(files.map(f => f.subject)).size}
                </p>
                <p className="text-sm text-muted-foreground">Subjects</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">
                  {files.reduce((sum, f) => sum + f.downloads, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-neon-cyan">
                  {new Set(files.map(f => f.category)).size}
                </p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {loadingFiles ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        ) : files.length === 0 ? (
          <Card className="glass-card p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No files available for your class.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="glass-card p-6 h-full hover:neon-glow transition-all group">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <FileText className="w-6 h-6 text-primary" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDownload(file)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-3 line-clamp-2">{file.name}</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={subjectColors[file.subject] || subjectColors.General}>
                        {file.subject}
                      </Badge>
                      <Badge variant="outline">{file.category}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(file.uploadDate), { addSuffix: true })}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {file.downloads} downloads
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Notes;
