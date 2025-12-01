import { motion } from "framer-motion";
import { ArrowLeft, StickyNote, Plus, Trash2, Edit } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const Notes = () => {
  const navigate = useNavigate();

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
      color: "neon-blue",
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

  const subjectColors: Record<string, string> = {
    Mathematics: "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30",
    Physics: "bg-neon-purple/20 text-neon-purple border-neon-purple/30",
    Chemistry: "bg-neon-pink/20 text-neon-pink border-neon-pink/30",
    "Computer Science": "bg-neon-blue/20 text-neon-blue border-neon-blue/30",
    English: "bg-accent/20 text-accent border-accent/30",
    General: "bg-primary/20 text-primary border-primary/30",
  };

  return (
    <div className="min-h-screen p-6 bg-background">
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
              <h1 className="text-4xl font-bold neon-text">My Notes</h1>
              <p className="text-muted-foreground">Quick notes and reminders</p>
            </motion.div>
          </div>
          <Button className="neon-glow">
            <Plus className="w-5 h-5 mr-2" />
            New Note
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">{notes.length}</p>
                <p className="text-sm text-muted-foreground">Total Notes</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-secondary">
                  {notes.filter(n => n.subject !== "General").length}
                </p>
                <p className="text-sm text-muted-foreground">Subject Notes</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">
                  {notes.filter(n => n.subject === "General").length}
                </p>
                <p className="text-sm text-muted-foreground">General</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-neon-cyan">Today</p>
                <p className="text-sm text-muted-foreground">Last Updated</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="glass-card p-6 h-full hover:neon-glow transition-all group">
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <StickyNote className={`w-6 h-6 text-${note.color}`} />
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-3">{note.title}</h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-4">
                    {note.content}
                  </p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <Badge className={subjectColors[note.subject]}>
                      {note.subject}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{note.date}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-card p-6 bg-primary/5 border-primary/30">
            <h3 className="font-semibold mb-2">💡 Note-taking Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Keep notes short and specific for easy reference</li>
              <li>• Use subject tags to organize your notes better</li>
              <li>• Review and update notes regularly</li>
              <li>• Add important formulas and key concepts</li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Notes;
