import { motion } from "framer-motion";
import { ArrowLeft, Bell, Send, Trash2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const TeacherAnnouncements = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  const classes = ["Class 10A", "Class 10B", "Class 11A"];

  const [announcements] = useState([
    {
      id: 1,
      title: "Mid-term Exam Schedule Released",
      message: "The mid-term examination schedule has been published. Check the schedule and prepare accordingly.",
      classes: ["All Classes"],
      urgent: true,
      date: "2024-11-28",
      views: 145
    },
    {
      id: 2,
      title: "Library Hours Extended",
      message: "Library will remain open until 8 PM this week to help students prepare for exams.",
      classes: ["All Classes"],
      urgent: false,
      date: "2024-11-27",
      views: 98
    },
    {
      id: 3,
      title: "Physics Lab Equipment Maintenance",
      message: "Physics lab will be closed on Friday for equipment maintenance. Lab classes are rescheduled.",
      classes: ["Class 10A", "Class 10B"],
      urgent: false,
      date: "2024-11-26",
      views: 67
    },
    {
      id: 4,
      title: "Sports Day Registration Open",
      message: "Register for sports day events before December 10th. Various inter-class competitions available.",
      classes: ["All Classes"],
      urgent: false,
      date: "2024-11-25",
      views: 132
    },
  ]);

  const toggleClass = (className: string) => {
    setSelectedClasses(prev =>
      prev.includes(className)
        ? prev.filter(c => c !== className)
        : [...prev, className]
    );
  };

  const sendAnnouncement = () => {
    if (!title || !message) {
      toast.error("Please fill in all fields");
      return;
    }
    if (selectedClasses.length === 0) {
      toast.error("Please select at least one class");
      return;
    }
    toast.success("Announcement sent successfully!");
    setTitle("");
    setMessage("");
    setIsUrgent(false);
    setSelectedClasses([]);
  };

  const deleteAnnouncement = (id: number) => {
    toast.success("Announcement deleted");
  };

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
            <h1 className="text-4xl font-bold neon-text">Announcements</h1>
            <p className="text-muted-foreground">Create and manage announcements</p>
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
                <p className="text-3xl font-bold text-primary">{announcements.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-destructive">
                  {announcements.filter(a => a.urgent).length}
                </p>
                <p className="text-sm text-muted-foreground">Urgent</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-secondary">
                  {announcements.reduce((acc, a) => acc + a.views, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">Today</p>
                <p className="text-sm text-muted-foreground">Last Posted</p>
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
              <Bell className="w-6 h-6 text-primary" />
              Create New Announcement
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Title</label>
                <Input
                  placeholder="Enter announcement title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="glass"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Message</label>
                <Textarea
                  placeholder="Enter announcement message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="glass min-h-[120px]"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-3 block">Select Classes</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {classes.map((className) => (
                    <div key={className} className="flex items-center gap-2">
                      <Checkbox
                        id={className}
                        checked={selectedClasses.includes(className)}
                        onCheckedChange={() => toggleClass(className)}
                      />
                      <label htmlFor={className} className="text-sm cursor-pointer">
                        {className}
                      </label>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="all"
                      checked={selectedClasses.length === classes.length}
                      onCheckedChange={() => {
                        if (selectedClasses.length === classes.length) {
                          setSelectedClasses([]);
                        } else {
                          setSelectedClasses(classes);
                        }
                      }}
                    />
                    <label htmlFor="all" className="text-sm cursor-pointer font-semibold">
                      All Classes
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="urgent"
                  checked={isUrgent}
                  onCheckedChange={(checked) => setIsUrgent(checked as boolean)}
                />
                <label htmlFor="urgent" className="text-sm cursor-pointer flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  Mark as urgent
                </label>
              </div>

              <div className="flex justify-end">
                <Button size="lg" className="neon-glow px-8" onClick={sendAnnouncement}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Announcement
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Announcements</h2>
          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <Card className={`glass-card p-6 hover:neon-glow transition-all ${
                  announcement.urgent ? 'border-destructive' : ''
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{announcement.title}</h3>
                        {announcement.urgent && (
                          <Badge variant="destructive">Urgent</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">{announcement.message}</p>
                      <div className="flex flex-wrap gap-2">
                        {announcement.classes.map(cls => (
                          <Badge key={cls} variant="secondary">{cls}</Badge>
                        ))}
                        <Badge variant="outline">{announcement.views} views</Badge>
                        <Badge variant="outline">{announcement.date}</Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => deleteAnnouncement(announcement.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
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

export default TeacherAnnouncements;
