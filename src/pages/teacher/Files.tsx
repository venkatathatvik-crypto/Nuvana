import { motion } from "framer-motion";
import { ArrowLeft, Upload, FileText, Trash2, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  getFileCategories,
  getTeacherClasses,
  getGradeSubjectsDetailed,
  getTeacherFiles,
  uploadTeacherFile,
  deleteTeacherFile,
  incrementFileDownload,
  type TeacherFileItem,
  type FileCategoryOption,
  type GradeSubjectOption,
} from "@/services/academic";
import type { FlattenedClass } from "@/schemas/academic";
import { useAuth } from "@/auth/AuthContext";

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

const TeacherFiles = () => {
  const navigate = useNavigate();
  const { profile, profileLoading } = useAuth();

  const [classes, setClasses] = useState<FlattenedClass[]>([]);
  const [fileCategories, setFileCategories] = useState<FileCategoryOption[]>(
    []
  );
  const [uploadClass, setUploadClass] = useState<FlattenedClass | null>(null);
  const [uploadSubjects, setUploadSubjects] = useState<GradeSubjectOption[]>(
    []
  );
  const [uploadSubjectId, setUploadSubjectId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [fileTitle, setFileTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<TeacherFileItem[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [classFilter, setClassFilter] = useState("All Classes");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");

  const subjectFilterOptions = useMemo(() => {
    const set = new Set<string>();
    uploadedFiles.forEach((file) => {
      if (file.subject) {
        set.add(file.subject);
      }
    });
    return ["All Subjects", ...Array.from(set).sort()];
  }, [uploadedFiles]);

  useEffect(() => {
    if (!subjectFilterOptions.includes(subjectFilter)) {
      setSubjectFilter("All Subjects");
    }
  }, [subjectFilterOptions, subjectFilter]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (profileLoading) return;

      if (!profile) {
        setClasses([]);
        setUploadClass(null);
        setFileCategories([]);
        setLoadingClasses(false);
        return;
      }

      try {
        const [classResponse, categoryResponse] = await Promise.all([
          getTeacherClasses(profile.id),
          getFileCategories(),
        ]);

        if (classResponse && classResponse.length > 0) {
          setClasses(classResponse);
          setUploadClass(classResponse[0]);
        } else {
          setClasses([]);
          setUploadClass(null);
        }

        if (categoryResponse && categoryResponse.length > 0) {
          setFileCategories(categoryResponse);
        } else {
          setFileCategories([]);
        }
      } catch (error) {
        console.error("Error fetching initial data for files:", error);
        toast.error("Failed to load data for files.");
        setClasses([]);
        setUploadClass(null);
        setFileCategories([]);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchInitialData();
  }, [profile, profileLoading]);

  useEffect(() => {
    if (fileCategories.length > 0 && selectedCategoryId === null) {
      setSelectedCategoryId(fileCategories[0].id);
    }
  }, [fileCategories, selectedCategoryId]);

  useEffect(() => {
    const fetchUploadSubjects = async () => {
      if (!uploadClass) {
        setUploadSubjects([]);
        setUploadSubjectId("");
        return;
      }

      try {
        const subjectResponse = await getGradeSubjectsDetailed(
          uploadClass.grade_id
        );
        setUploadSubjects(subjectResponse);
        setUploadSubjectId(subjectResponse[0]?.id ?? "");
      } catch (error) {
        console.error(
          `Error fetching subjects for upload (Grade ID ${uploadClass.grade_id}):`,
          error
        );
        setUploadSubjects([]);
        setUploadSubjectId("");
      }
    };

    fetchUploadSubjects();
  }, [uploadClass]);

  useEffect(() => {
    const fetchFiles = async () => {
      if (profileLoading) return;

      if (!profile) {
        setUploadedFiles([]);
        setLoadingFiles(false);
        return;
      }

      try {
        const files = await getTeacherFiles(profile.id);
        setUploadedFiles(files);
      } catch (error) {
        console.error("Error fetching teacher files:", error);
        toast.error("Failed to load uploaded files.");
        setUploadedFiles([]);
      } finally {
        setLoadingFiles(false);
      }
    };

    fetchFiles();
  }, [profile, profileLoading]);

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      toast.error("File size must be 5MB or less.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!profile) {
      toast.error("You must be logged in to upload files.");
      return;
    }

    if (
      !fileTitle.trim() ||
      !selectedCategoryId ||
      !uploadClass ||
      !uploadSubjectId ||
      !selectedFile
    ) {
      toast.error("Please complete all fields and choose a PDF file.");
      return;
    }

    setIsUploading(true);
    try {
      const newFile = await uploadTeacherFile({
        file: selectedFile,
        title: fileTitle.trim(),
        categoryId: selectedCategoryId,
        classId: uploadClass.class_id,
        gradeSubjectId: uploadSubjectId,
        teacherId: profile.id,
      });

      setUploadedFiles((prev) => [newFile, ...prev]);
      toast.success("File uploaded successfully!");

      setFileTitle("");
      setSelectedFile(null);
      setUploadSubjectId(uploadSubjects[0]?.id ?? "");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to upload file.";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    const file = uploadedFiles.find((item) => item.id === fileId);
    if (!file) {
      toast.error("Unable to find file.");
      return;
    }

    try {
      await deleteTeacherFile(file.id, file.storagePath);
      setUploadedFiles((prev) => prev.filter((item) => item.id !== fileId));
      toast.success("File deleted successfully.");
    } catch (error) {
      console.error("Delete error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to delete file.";
      toast.error(message);
    }
  };

  const handleDownload = async (file: TeacherFileItem) => {
    if (!file.storageUrl) {
      toast.error("File URL is unavailable.");
      return;
    }

    try {
      const newCount = await incrementFileDownload(file.id);
      setUploadedFiles((prev) =>
        prev.map((item) =>
          item.id === file.id ? { ...item, downloads: newCount } : item
        )
      );
    } catch (error) {
      console.error("Download count error:", error);
      toast.error("Failed to update download count.");
    }

    window.open(file.storageUrl, "_blank", "noopener,noreferrer");
  };

  const filteredFiles = uploadedFiles.filter((file) => {
    const classMatch =
      classFilter === "All Classes" || file.class === classFilter;
    const subjectMatch =
      subjectFilter === "All Subjects" || file.subject === subjectFilter;
    return classMatch && subjectMatch;
  });

  if (loadingClasses || loadingFiles) {
    return <LoadingSpinner />;
  }

  if (classes.length === 0) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center text-xl font-semibold text-destructive">
        No classes available or assigned for files.
      </div>
    );
  }

  const totalDownloads = uploadedFiles.reduce(
    (acc, file) => acc + (file.downloads ?? 0),
    0
  );

  const subjectCount = Math.max(subjectFilterOptions.length - 1, 0);

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
            <h1 className="text-4xl font-bold neon-text">Upload Files</h1>
            <p className="text-muted-foreground">
              Share books, notes, and materials
            </p>
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
                <p className="text-3xl font-bold text-primary">
                  {uploadedFiles.length}
                </p>
                <p className="text-sm text-muted-foreground">Total Files</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-secondary">
                  {totalDownloads}
                </p>
                <p className="text-sm text-muted-foreground">Downloads</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">{subjectCount}</p>
                <p className="text-sm text-muted-foreground">Subjects</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-neon-cyan">
                  {fileCategories.length}
                </p>
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
                <label className="text-sm text-muted-foreground mb-2 block">
                  File Title
                </label>
                <Input
                  placeholder="Enter file title"
                  className="glass"
                  value={fileTitle}
                  onChange={(e) => setFileTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Category
                </label>
                <select
                  className="w-full p-3 rounded-lg bg-muted border border-border"
                  value={selectedCategoryId ?? ""}
                  onChange={(e) =>
                    setSelectedCategoryId(Number(e.target.value))
                  }
                >
                  {fileCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Class
                </label>
                <select
                  className="w-full p-3 rounded-lg bg-muted border border-border"
                  value={uploadClass ? uploadClass.class_id : ""}
                  onChange={(e) => {
                    const cls = classes.find(
                      (c) => c.class_id === e.target.value
                    );
                    if (cls) {
                      setUploadClass(cls);
                    } else {
                      setUploadClass(null);
                    }
                  }}
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
                  Subject
                </label>
                <select
                  className="w-full p-3 rounded-lg bg-muted border border-border"
                  value={uploadSubjectId}
                  onChange={(e) => setUploadSubjectId(e.target.value)}
                  disabled={uploadSubjects.length === 0}
                >
                  {uploadSubjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                  {uploadSubjects.length === 0 && (
                    <option disabled>No subjects for this class</option>
                  )}
                </select>
              </div>
            </div>

            <div
              className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-muted-foreground">
                PDF only (max. 5MB)
              </p>
              {selectedFile && (
                <p className="text-sm text-primary mt-2">
                  Selected: {selectedFile.name}
                </p>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileSelection}
              />
            </div>

            <div className="flex justify-end mt-6">
              <Button
                size="lg"
                className="neon-glow px-8"
                onClick={handleUpload}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload File"}
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
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
              >
                <option value="All Classes">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls.class_id} value={cls.class_name}>
                    {cls.class_name}
                  </option>
                ))}
              </select>
              <select
                className="p-2 rounded-lg bg-muted border border-border"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
              >
                {subjectFilterOptions.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
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
                        <h3 className="font-semibold text-lg mb-2">
                          {file.name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{file.subject}</Badge>
                          <Badge variant="outline">{file.class}</Badge>
                          <Badge variant="outline">{file.category}</Badge>
                          <Badge variant="outline">{file.size ?? "—"}</Badge>
                          <Badge variant="outline">
                            {file.downloads} downloads
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Uploaded:{" "}
                          {file.uploadDate
                            ? new Date(file.uploadDate)
                                .toISOString()
                                .split("T")[0]
                            : "-"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="glass"
                        onClick={() => handleDownload(file)}
                      >
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
