import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Download, Eye, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const Books = () => {
  const navigate = useNavigate();

  const subjects = [
    {
      name: "Mathematics",
      color: "neon-cyan",
      materials: [
        { title: "Textbook - Class 12", type: "PDF", size: "45 MB", pages: 420, downloads: 234 },
        { title: "Reference Book - R.D. Sharma", type: "PDF", size: "78 MB", pages: 680, downloads: 456 },
        { title: "Formula Sheet", type: "PDF", size: "2 MB", pages: 15, downloads: 892 },
        { title: "Previous Year Papers", type: "PDF", size: "12 MB", pages: 85, downloads: 567 },
        { title: "Practice Problems", type: "PDF", size: "8 MB", pages: 120, downloads: 345 },
      ]
    },
    {
      name: "Physics",
      color: "neon-purple",
      materials: [
        { title: "NCERT Physics Part 1", type: "PDF", size: "38 MB", pages: 380, downloads: 198 },
        { title: "NCERT Physics Part 2", type: "PDF", size: "42 MB", pages: 410, downloads: 187 },
        { title: "H.C. Verma - Concepts", type: "PDF", size: "92 MB", pages: 750, downloads: 412 },
        { title: "Lab Manual", type: "PDF", size: "18 MB", pages: 145, downloads: 289 },
        { title: "Important Numericals", type: "PDF", size: "6 MB", pages: 68, downloads: 523 },
      ]
    },
    {
      name: "Chemistry",
      color: "neon-pink",
      materials: [
        { title: "Organic Chemistry", type: "PDF", size: "56 MB", pages: 520, downloads: 267 },
        { title: "Inorganic Chemistry", type: "PDF", size: "48 MB", pages: 460, downloads: 245 },
        { title: "Physical Chemistry", type: "PDF", size: "52 MB", pages: 490, downloads: 256 },
        { title: "Reaction Mechanisms", type: "PDF", size: "15 MB", pages: 98, downloads: 389 },
        { title: "Periodic Table Guide", type: "PDF", size: "3 MB", pages: 24, downloads: 678 },
      ]
    },
    {
      name: "Computer Science",
      color: "blue-500",
      materials: [
        { title: "Python Programming", type: "PDF", size: "34 MB", pages: 340, downloads: 445 },
        { title: "Data Structures", type: "PDF", size: "28 MB", pages: 285, downloads: 378 },
        { title: "Database Management", type: "PDF", size: "22 MB", pages: 220, downloads: 312 },
        { title: "Computer Networks", type: "PDF", size: "26 MB", pages: 268, downloads: 289 },
        { title: "Programming Projects", type: "PDF", size: "12 MB", pages: 95, downloads: 501 },
      ]
    },
    {
      name: "English",
      color: "text-accent",
      materials: [
        { title: "Literature Textbook", type: "PDF", size: "32 MB", pages: 310, downloads: 176 },
        { title: "Grammar Guide", type: "PDF", size: "18 MB", pages: 165, downloads: 423 },
        { title: "Essay Writing Tips", type: "PDF", size: "5 MB", pages: 42, downloads: 589 },
        { title: "Poetry Analysis", type: "PDF", size: "8 MB", pages: 78, downloads: 267 },
        { title: "Sample Papers", type: "PDF", size: "10 MB", pages: 92, downloads: 445 },
      ]
    },
  ];

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

        <Tabs defaultValue={subjects[0].name} className="w-full">
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
                  key={index}
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
                            <Badge variant="outline">{material.pages} pages</Badge>
                            <Badge variant="outline">{material.downloads} downloads</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="glass">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" className="neon-glow">
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
