import { motion } from "framer-motion";
import { ArrowLeft, Upload, FileText, Trash2, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const TeacherFiles = () => {
  const navigate = useNavigate();

  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");

  const classes = ["All Classes", "Class 10A", "Class 10B", "Class 11A"];
  const subjects = ["All Subjects", "Mathematics", "Physics", "Chemistry", "Computer Science", "English"];
  
  const fileCategories = ["Textbooks", "Lecture Notes", "Assignments", "Previous Papers", "Study Materials"];

  const [uploadedFiles] = useState([
    { 
      id: 1, 
      name: "Mathematics Chapter 5 Notes.pdf", 
      class: "Class 10A", 
      subject: "Mathematics",
      category: "Lecture Notes",
      size: "2.5 MB", 
      uploadDate: "2024-11-28",
      downloads: 45 
    },
    { 
      id: 2, 
      name: "Physics Practical Manual.pdf", 
      class: "Class 10B", 
      subject: "Physics",
      category: "Study Materials",
      size: "5.2 MB", 
      uploadDate: "2024-11-27",
      downloads: 32 
    },
    { 
      id: 3, 
      name: "Chemistry Periodic Table.pdf", 
      class: "All Classes", 
      subject: "Chemistry",
      category: "Study Materials",
      size: "1.8 MB", 
      uploadDate: "2024-11-26",
      downloads: 78 
    },
    { 
      id: 4, 
      name: "Computer Science Assignment 3.pdf", 
      class: "Class 11A", 
      subject: "Computer Science",
      category: "Assignments",
      size: "0.5 MB", 
      uploadDate: "2024-11-25",
      downloads: 28 
    },
    { 
      id: 5, 
      name: "English Grammar Textbook.pdf", 
      class: "All Classes", 
      subject: "English",
      category: "Textbooks",
      size: "12.3 MB", 
      uploadDate: "2024-11-24",
      downloads: 56 
    },
  ]);

  const handleUpload = () => {
    toast.success("File uploaded successfully!");
  };

  const handleDelete = (fileId: number) => {
    toast.success("File deleted successfully");
  };

  const filteredFiles = uploadedFiles.filter(file => {
    const classMatch = selectedClass === "All Classes" || file.class === selectedClass || file.class === "All Classes";
    const subjectMatch = selectedSubject === "All Subjects" || file.subject === selectedSubject;
    return classMatch && subjectMatch;
  });

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/teacher")}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold neon-text">Upload Files</h1>
            <p className="text-muted-foreground">Share books, notes, and materials</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">{uploadedFiles.length}</p>
                <p className="text-sm text-muted-foreground">Total Files</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-secondary">
                  {uploadedFiles.reduce((acc, file) => acc + file.downloads, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Downloads</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">{subjects.length - 1}</p>
                <p className="text-sm text-muted-foreground">Subjects</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-neon-cyan">{fileCategories.length}</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Upload className="w-6 h-6 text-primary" />
              Upload New File
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">File Title</label>
                <Input placeholder="Enter file title" className="glass" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Category</label>
                <select className="w-full p-3 rounded-lg bg-muted border border-border">
                  {fileCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Class</label>
                <select className="w-full p-3 rounded-lg bg-muted border border-border">
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Subject</label>
                <select className="w-full p-3 rounded-lg bg-muted border border-border">
                  {subjects.filter(s => s !== "All Subjects").map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-muted-foreground">PDF, DOC, PPT (max. 50MB)</p>
            </div>

            <div className="flex justify-end mt-6">
              <Button size="lg" className="neon-glow px-8" onClick={handleUpload}>
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
            </div>
          </Card>
        </motion.div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Uploaded Files</h2>
            <div className="flex gap-4">
              <select
                className="p-2 rounded-lg bg-muted border border-border"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
              <select
                className="p-2 rounded-lg bg-muted border border-border"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {subjects.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredFiles.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <Card className="glass-card p-6 hover:neon-glow transition-all">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 rounded-lg bg-primary/20">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{file.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{file.subject}</Badge>
                          <Badge variant="outline">{file.class}</Badge>
                          <Badge variant="outline">{file.category}</Badge>
                          <Badge variant="outline">{file.size}</Badge>
                          <Badge variant="outline">{file.downloads} downloads</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Uploaded: {file.uploadDate}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="glass">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="glass text-destructive"
                        onClick={() => handleDelete(file.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherFiles;
