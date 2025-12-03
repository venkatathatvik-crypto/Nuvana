import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Download, Eye, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/auth/AuthContext";
import { getStudentData, getStudentFiles, incrementFileDownload } from "@/services/academic";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "sonner";

const Books = () => {
  const navigate = useNavigate();
  const { profile, profileLoading } = useAuth();
  const [files, setFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [studentClassId, setStudentClassId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentBooks = async () => {
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
        console.error("Error fetching student books:", error);
        toast.error("Failed to load books.");
      } finally {
        setLoadingFiles(false);
      }
    };

    fetchStudentBooks();
  }, [profile, profileLoading]);

  const subjectColors: Record<string, string> = {
    Mathematics: "neon-cyan",
    Physics: "neon-purple",
    Chemistry: "neon-pink",
    "Computer Science": "neon-blue",
    English: "text-accent",
  };

  // Group files by subject
  const subjects = useMemo(() => {
    if (files.length === 0) return [];

    const groupedBySubject: Record<string, any[]> = {};

    files.forEach((file) => {
      const subjectName = file.subject || "Other";
      if (!groupedBySubject[subjectName]) {
        groupedBySubject[subjectName] = [];
      }
      groupedBySubject[subjectName].push({
        id: file.id,
        title: file.name,
        type: "PDF",
        size: file.size || "N/A",
        downloads: file.downloads,
        storageUrl: file.storageUrl,
        storagePath: file.storagePath,
      });
    });

    return Object.keys(groupedBySubject).map((subjectName) => ({
      name: subjectName,
      color: subjectColors[subjectName] || "text-primary",
      materials: groupedBySubject[subjectName],
    }));
  }, [files]);

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

      toast.success("File downloaded successfully");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file.");
    }
  };

  const handleView = (file: any) => {
    window.open(file.storageUrl, "_blank");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/student")}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold neon-text">Books & Materials</h1>
            <p className="text-muted-foreground">Access your study materials</p>
          </motion.div>
        </div>

        {loadingFiles ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        ) : subjects.length === 0 ? (
          <Card className="glass-card p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">No Books Available</h2>
            <p className="text-muted-foreground">There are no books or materials available for your class at the moment.</p>
          </Card>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-card p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-primary">{subjects.length}</p>
                    <p className="text-sm text-muted-foreground">Subjects</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-secondary">
                      {subjects.reduce((acc, sub) => acc + sub.materials.length, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Files</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-accent">PDF</p>
                    <p className="text-sm text-muted-foreground">Format</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-neon-cyan">24/7</p>
                    <p className="text-sm text-muted-foreground">Access</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <Tabs defaultValue={subjects[0]?.name || ""} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
                {subjects.map((subject) => (
                  <TabsTrigger key={subject.name} value={subject.name}>
                    {subject.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {subjects.map((subject, subIndex) => (
                <TabsContent key={subject.name} value={subject.name} className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                      <BookOpen className={`w-6 h-6 text-${subject.color}`} />
                      {subject.name} Materials
                    </h2>
                  </motion.div>

                  {subject.materials.map((material, index) => (
                    <motion.div
                      key={material.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Card className="glass-card p-6 hover:neon-glow transition-all">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-primary/20">
                              <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold mb-2">{material.title}</h3>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">{material.type}</Badge>
                                <Badge variant="outline">{material.size}</Badge>
                                <Badge variant="outline">{material.downloads} downloads</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="glass"
                              onClick={() => handleView(material)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              className="neon-glow"
                              onClick={() => handleDownload(material)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="glass-card p-6 bg-primary/5 border-primary/30">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Study Tips
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Download materials in advance for offline access</li>
              <li>• Review reference books for better understanding</li>
              <li>• Practice with previous year papers regularly</li>
              <li>• Use formula sheets for quick revision</li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Books;
