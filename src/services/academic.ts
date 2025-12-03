import { supabase } from "@/supabase/client";
import { NestedClass, FlattenedClass } from "@/schemas/academic";

interface RawSubjectData {
  subject_master_id: string;
  subjects_master: { name: string } | { name: string }[];
}

interface TeacherClassRow {
  class_id: string;
  classes: NestedClass | NestedClass[] | null;
}

interface GradeSubjectRow {
  id: string;
  subjects_master:
    | {
        name: string;
      }
    | {
        name: string;
      }[]
    | null;
}

const FILES_BUCKET =
  import.meta.env?.VITE_SUPABASE_FILES_BUCKET?.toString() || "FILES_BUCKET";
const VOICE_NOTES_BUCKET =
  import.meta.env?.VITE_SUPABASE_VOICE_NOTES_BUCKET?.toString() ||
  "FILES_BUCKET";

export interface GradeSubjectOption {
  id: string;
  name: string;
}

export interface FileCategoryOption {
  id: number;
  name: string;
}

export interface TeacherFileItem {
  id: string;
  name: string;
  class: string;
  subject: string;
  category: string;
  storageUrl: string;
  storagePath: string;
  downloads: number;
  uploadDate: string;
  size?: string;
}

interface UploadTeacherFileParams {
  file: File;
  title: string;
  categoryId: number;
  classId: string;
  gradeSubjectId: string;
  teacherId: string;
}

interface NamedEntity {
  name: string;
}

type NamedClass = {
  id: string;
  name: string;
};

interface TeacherFileRow {
  id: string;
  file_title: string;
  storage_url: string;
  download_count: number | null;
  created_at: string;
  file_categories: NamedEntity | NamedEntity[] | null;
  classes: NamedEntity | NamedEntity[] | null;
  grade_subjects:
    | {
        subjects_master: NamedEntity | NamedEntity[] | null;
      }
    | {
        subjects_master: NamedEntity | NamedEntity[] | null;
      }[]
    | null;
}

interface StoragePathRow {
  storage_url: string | null;
}

export interface TeacherAnnouncement {
  id: string;
  title: string;
  message: string;
  isUrgent: boolean;
  createdAt: string;
  classes: { class_id: string; class_name: string }[];
  views?: number;
}

interface AnnouncementRow {
  id: string;
  title: string;
  message: string;
  is_urgent: boolean;
  created_at: string;
  announcement_classes: {
    class_id: string;
    classes: NamedClass | NamedClass[] | null;
  }[];
}

interface AnnouncementInsertResult {
  id: string;
}

export const getClasses = async (): Promise<FlattenedClass[]> => {
  const { data: rawData, error } = await supabase.from("classes").select(`
    id,
    name,
    grade_levels (
      id,
      name
    )
  `);

  if (error) {
    console.error("Error fetching classes:", error);
    throw new Error("Failed to load class data.");
  }

  if (!rawData) {
    return null;
  }

  // 3. Client-Side Mapping (Transformation)
  const flattenedClasses: FlattenedClass[] = rawData.map(
    (item: NestedClass) => {
      const gradeData = Array.isArray(item.grade_levels)
        ? item.grade_levels[0]
        : item.grade_levels;

      return {
        class_id: item.id,
        class_name: item.name,
        grade_id: gradeData ? gradeData.id : 0,
        grade_name: gradeData ? gradeData.name : "Unknown Grade",
      };
    }
  );

  return flattenedClasses;
};

export const getExamTypes = async (): Promise<string[]> => {
  const { data, error } = await supabase.from("exam_types").select("name");
  if (error) {
    console.error("Error fetching exam types:", error);
    throw new Error("Failed to load exam types.");
  }
  if (!data) {
    return [];
  }
  return data.map((item) => item.name);
};

export const getSubjects = async (gradeLevelId: number): Promise<string[]> => {
  const { data: grade_subjects, error } = await supabase
    .from("grade_subjects")
    .select(
      `
      subject_master_id,
      subjects_master (
        name
      )
    `
    )
    .eq("grade_level_id", gradeLevelId);

  if (error) {
    console.error("Error fetching subjects:", error);
    throw new Error("Failed to load subjects.");
  }
  if (!grade_subjects) {
    return [];
  }

  return grade_subjects
    .map((item: RawSubjectData) => {
      const masterSubject = item.subjects_master;

      if (Array.isArray(masterSubject) && masterSubject.length > 0) {
        return masterSubject[0].name;
      }

      if (
        masterSubject &&
        typeof masterSubject === "object" &&
        "name" in masterSubject
      ) {
        return masterSubject.name;
      }

      return null;
    })
    .filter((name): name is string => name !== null); // Filter out any null values
};

export const getFileCategories = async (): Promise<FileCategoryOption[]> => {
  const { data, error } = await supabase
    .from("file_categories")
    .select("id, name")
    .order("name");
  if (error) {
    console.error("Error fetching file categories:", error);
    throw new Error("Failed to load file categories.");
  }
  if (!data) {
    return [];
  }
  return data.map((item) => ({
    id: item.id,
    name: item.name,
  }));
};

export const getTeacherClasses = async (
  teacherId: string
): Promise<FlattenedClass[]> => {
  console.log("[getTeacherClasses] Filtering by teacher_id:", teacherId);
  const { data, error } = await supabase
    .from("teacher_classes")
    .select(
      `
      class_id,
      classes (
        id,
        name,
        grade_levels (
          id,
          name
        )
      )
    `
    )
    .eq("teacher_id", teacherId);

  if (error) {
    console.error("Error fetching teacher classes:", error);
    throw new Error("Failed to load teacher classes.");
  }

  console.log(
    "[getTeacherClasses] Found",
    data?.length || 0,
    "classes for teacher",
    teacherId
  );
  if (data && data.length > 0) {
    console.log(
      "[getTeacherClasses] Class names:",
      data.map((item: any) => {
        const classData = Array.isArray(item.classes)
          ? item.classes[0]
          : item.classes;
        return classData?.name || "Unknown";
      })
    );
  }

  if (!data) {
    return [];
  }

  const flattenedClasses: FlattenedClass[] = data
    .map((item: TeacherClassRow) => {
      const classData = Array.isArray(item.classes)
        ? item.classes[0]
        : item.classes;

      if (!classData) return null;

      const gradeData = Array.isArray(classData.grade_levels)
        ? classData.grade_levels[0]
        : classData.grade_levels;

      return {
        class_id: classData.id,
        class_name: classData.name,
        grade_id: gradeData ? gradeData.id : 0,
        grade_name: gradeData ? gradeData.name : "Unknown Grade",
      };
    })
    .filter((cls): cls is FlattenedClass => cls !== null);

  return flattenedClasses;
};

export const getGradeSubjectsDetailed = async (
  gradeLevelId: number
): Promise<GradeSubjectOption[]> => {
  const { data, error } = await supabase
    .from("grade_subjects")
    .select(
      `
      id,
      subjects_master (
        name
      )
    `
    )
    .eq("grade_level_id", gradeLevelId);

  if (error) {
    console.error("Error fetching grade subjects:", error);
    throw new Error("Failed to load subjects.");
  }

  if (!data) {
    return [];
  }

  return data
    .map((item: GradeSubjectRow) => {
      let subjectName: string | null = null;
      if (Array.isArray(item.subjects_master)) {
        subjectName =
          item.subjects_master.length > 0 ? item.subjects_master[0].name : null;
      } else if (item.subjects_master) {
        subjectName = item.subjects_master.name;
      }

      if (!subjectName) {
        return null;
      }

      return {
        id: item.id,
        name: subjectName,
      };
    })
    .filter((option): option is GradeSubjectOption => option !== null);
};

const resolveName = (
  entity: NamedEntity | NamedEntity[] | null | undefined
): string | undefined => {
  if (!entity) return undefined;
  if (Array.isArray(entity)) {
    return entity.length > 0 ? entity[0]?.name : undefined;
  }
  return entity.name;
};

const mapFileRecordToItem = (record: TeacherFileRow): TeacherFileItem => {
  const { data: publicUrlData } = supabase.storage
    .from(FILES_BUCKET)
    .getPublicUrl(record.storage_url);

  const categoryName = resolveName(record.file_categories);
  const className = resolveName(record.classes);

  let subjectName: string | undefined;
  if (Array.isArray(record.grade_subjects)) {
    subjectName = resolveName(record.grade_subjects[0]?.subjects_master);
  } else {
    subjectName = resolveName(record.grade_subjects?.subjects_master);
  }

  return {
    id: record.id,
    name: record.file_title,
    class: className ?? "Unknown Class",
    subject: subjectName ?? "Unknown Subject",
    category: categoryName ?? "Unknown Category",
    storageUrl: publicUrlData.publicUrl,
    storagePath: record.storage_url,
    downloads: record.download_count ?? 0,
    uploadDate: record.created_at,
  };
};

export const getTeacherFiles = async (
  teacherId: string
): Promise<TeacherFileItem[]> => {
  const { data, error } = await supabase
    .from("files")
    .select(
      `
      id,
      file_title,
      storage_url,
      download_count,
      created_at,
      class_id,
      grade_subject_id,
      category_id,
      file_categories ( id, name ),
      classes ( id, name ),
      grade_subjects (
        subjects_master ( name )
      )
    `
    )
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching teacher files:", error);
    throw new Error("Failed to load uploaded files.");
  }

  if (!data) {
    return [];
  }

  return data.map((record) => mapFileRecordToItem(record as TeacherFileRow));
};

export const uploadTeacherFile = async (
  params: UploadTeacherFileParams
): Promise<TeacherFileItem> => {
  const { file, teacherId, classId, gradeSubjectId, categoryId, title } =
    params;

  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File size must be 5MB or less.");
  }

  const filePath = `${teacherId}/${Date.now()}-${file.name}`;

  const { data: storageData, error: storageError } = await supabase.storage
    .from(FILES_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      contentType: "application/pdf",
      upsert: false,
    });

  if (storageError || !storageData) {
    console.error("Error uploading file to storage:", storageError);
    throw new Error("Failed to upload file.");
  }

  const { data, error } = await supabase
    .from("files")
    .insert({
      file_title: title,
      category_id: categoryId,
      class_id: classId,
      grade_subject_id: gradeSubjectId,
      storage_url: storageData.path,
      teacher_id: teacherId,
    })
    .select(
      `
      id,
      file_title,
      storage_url,
      download_count,
      created_at,
      file_categories ( id, name ),
      classes ( id, name ),
      grade_subjects (
        subjects_master ( name )
      )
    `
    )
    .single();

  if (error || !data) {
    console.error("Error saving file metadata:", error);
    throw new Error("Failed to save file information.");
  }

  const mapped = mapFileRecordToItem(data as TeacherFileRow);
  mapped.size = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
  return mapped;
};

const normalizeStoragePath = (
  rawPath: string | null | undefined
): string | null => {
  if (!rawPath) return null;
  if (!rawPath.startsWith("http")) {
    return rawPath.replace(/^\/+/, "");
  }

  try {
    const url = new URL(rawPath);
    const bucketMarker = `/${FILES_BUCKET}/`;
    const idx = url.pathname.indexOf(bucketMarker);
    if (idx !== -1) {
      return url.pathname
        .substring(idx + bucketMarker.length)
        .replace(/^\/+/, "");
    }
    return url.pathname.replace(/^\/+/, "");
  } catch {
    return rawPath;
  }
};

export const deleteTeacherFile = async (
  fileId: string,
  storagePath: string
): Promise<void> => {
  let normalizedPath = normalizeStoragePath(storagePath);

  if (!normalizedPath) {
    const { data, error } = await supabase
      .from("files")
      .select("storage_url")
      .eq("id", fileId)
      .single<StoragePathRow>();

    if (error) {
      console.error("Error fetching storage path:", error);
      throw new Error("Failed to locate file path.");
    }
    normalizedPath = normalizeStoragePath(data?.storage_url);
  }

  if (!normalizedPath) {
    throw new Error("File path missing; cannot delete from storage.");
  }

  const { error: storageError } = await supabase.storage
    .from(FILES_BUCKET)
    .remove([normalizedPath]);

  if (storageError) {
    console.error("Error deleting from storage:", storageError);
    throw new Error("Failed to delete file from storage.");
  }

  const { error: deleteError } = await supabase
    .from("files")
    .delete()
    .eq("id", fileId);

  if (deleteError) {
    console.error("Error deleting file record:", deleteError);
    throw new Error("Failed to delete file record.");
  }
};

interface DownloadCountRow {
  download_count: number | null;
}

export const incrementFileDownload = async (
  fileId: string
): Promise<number> => {
  const { data, error } = await supabase
    .from("files")
    .select("download_count")
    .eq("id", fileId)
    .single<DownloadCountRow>();

  if (error) {
    console.error("Error fetching download count:", error);
    throw new Error("Failed to fetch download count.");
  }

  const nextCount = (data?.download_count ?? 0) + 1;
  const { error: updateError } = await supabase
    .from("files")
    .update({ download_count: nextCount })
    .eq("id", fileId);

  if (updateError) {
    console.error("Error updating download count:", updateError);
    throw new Error("Failed to update download count.");
  }

  return nextCount;
};

const mapAnnouncementRecord = (
  record: AnnouncementRow
): TeacherAnnouncement => {
  const classes =
    record.announcement_classes?.map((item) => {
      const classData = Array.isArray(item.classes)
        ? item.classes[0]
        : item.classes;
      return {
        class_id: item.class_id,
        class_name: classData?.name ?? "Unknown Class",
      };
    }) ?? [];

  return {
    id: record.id,
    title: record.title,
    message: record.message,
    isUrgent: record.is_urgent,
    createdAt: record.created_at,
    classes,
    views: 0,
  };
};

export const getTeacherAnnouncements = async (
  teacherId: string
): Promise<TeacherAnnouncement[]> => {
  const { data, error } = await supabase
    .from("announcements")
    .select(
      `
      id,
      title,
      message,
      is_urgent,
      created_at,
      announcement_classes (
        class_id,
        classes (
          id,
          name
        )
      )
    `
    )
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching announcements:", error);
    throw new Error("Failed to load announcements.");
  }

  if (!data) {
    return [];
  }

  return data.map((record) => mapAnnouncementRecord(record as AnnouncementRow));
};

interface CreateAnnouncementParams {
  title: string;
  message: string;
  isUrgent: boolean;
  classIds: string[];
  teacherId: string;
}

export const createTeacherAnnouncement = async (
  params: CreateAnnouncementParams
): Promise<TeacherAnnouncement> => {
  const { title, message, isUrgent, classIds, teacherId } = params;

  const { data: announcementData, error: announcementError } = await supabase
    .from("announcements")
    .insert({
      title,
      message,
      is_urgent: isUrgent,
      teacher_id: teacherId,
    })
    .select("id, created_at")
    .single<AnnouncementInsertResult>();

  if (announcementError || !announcementData) {
    console.error("Error creating announcement:", announcementError);
    throw new Error("Failed to create announcement.");
  }

  if (classIds.length > 0) {
    const rows = classIds.map((classId) => ({
      announcement_id: announcementData.id,
      class_id: classId,
    }));

    const { error: classError } = await supabase
      .from("announcement_classes")
      .insert(rows);

    if (classError) {
      console.error("Error linking announcement classes:", classError);
      throw new Error("Failed to link announcement classes.");
    }
  }

  // Fetch full record for mapping
  const { data, error } = await supabase
    .from("announcements")
    .select(
      `
      id,
      title,
      message,
      is_urgent,
      created_at,
      announcement_classes (
        class_id,
        classes (
          id,
          name
        )
      )
    `
    )
    .eq("id", announcementData.id)
    .single<AnnouncementRow>();

  if (error || !data) {
    console.error("Error fetching new announcement:", error);
    throw new Error("Failed to load new announcement.");
  }

  return mapAnnouncementRecord(data);
};

export const deleteTeacherAnnouncement = async (
  announcementId: string,
  classId: string
): Promise<void> => {
  const { error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", announcementId);

  if (error) {
    console.error("Error deleting announcement:", error);
    throw new Error("Failed to delete announcement.");
  }
};

// Student-related interfaces and functions
export interface StudentData {
  id: string;
  class_id: string;
  class_name?: string;
  grade_name?: string;
  roll_number?: string;
}

export interface StudentFileItem {
  id: string;
  name: string;
  class: string;
  subject: string;
  category: string;
  storageUrl: string;
  storagePath: string;
  downloads: number;
  uploadDate: string;
  size?: string;
}

export interface StudentAnnouncement {
  id: string;
  title: string;
  message: string;
  isUrgent: boolean;
  createdAt: string;
  class_name: string;
}

// Get student data including class_id
export const getStudentData = async (
  studentId: string
): Promise<StudentData | null> => {
  const { data, error } = await supabase
    .from("students")
    .select(
      `
      id,
      class_id,
      roll_number,
      classes (
        id,
        name,
        grade_levels (
          id,
          name
        )
      )
    `
    )
    .eq("id", studentId)
    .single();

  if (error) {
    console.error("Error fetching student data:", error);
    throw new Error("Failed to load student data.");
  }

  if (!data) {
    return null;
  }

  const classData = Array.isArray(data.classes)
    ? data.classes[0]
    : data.classes;

  const gradeData = classData?.grade_levels
    ? Array.isArray(classData.grade_levels)
      ? classData.grade_levels[0]
      : classData.grade_levels
    : null;

  return {
    id: data.id,
    class_id: data.class_id,
    class_name: classData?.name,
    grade_name: gradeData?.name,
    roll_number: data.roll_number,
  };
};

// Get files filtered by class_id for students
export const getStudentFiles = async (
  classId: string
): Promise<StudentFileItem[]> => {
  const { data, error } = await supabase
    .from("files")
    .select(
      `
      id,
      file_title,
      storage_url,
      download_count,
      created_at,
      class_id,
      file_categories ( id, name ),
      classes ( id, name ),
      grade_subjects (
        subjects_master ( name )
      )
    `
    )
    .eq("class_id", classId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching student files:", error);
    throw new Error("Failed to load files.");
  }

  if (!data) {
    return [];
  }

  return data.map((record) => mapFileRecordToItem(record as TeacherFileRow));
};

// Get announcements filtered by class_id for students
export const getStudentAnnouncements = async (
  classId: string
): Promise<StudentAnnouncement[]> => {
  const { data, error } = await supabase
    .from("announcement_classes")
    .select(
      `
      announcement_id,
      announcements (
        id,
        title,
        message,
        is_urgent,
        created_at
      ),
      classes (
        id,
        name
      )
    `
    )
    .eq("class_id", classId);

  if (error) {
    console.error("Error fetching student announcements:", error);
    throw new Error("Failed to load announcements.");
  }

  if (!data) {
    return [];
  }

  return data
    .map((item) => {
      const announcement = Array.isArray(item.announcements)
        ? item.announcements[0]
        : item.announcements;
      const classData = Array.isArray(item.classes)
        ? item.classes[0]
        : item.classes;

      if (!announcement) return null;

      return {
        id: announcement.id,
        title: announcement.title,
        message: announcement.message,
        isUrgent: announcement.is_urgent,
        createdAt: announcement.created_at,
        class_name: classData?.name ?? "Unknown Class",
      };
    })
    .filter((ann): ann is StudentAnnouncement => ann !== null)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

// Test-related interfaces and functions
export interface TestQuestion {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  marks: number;
  chapter: string;
  topic: string;
}

export interface TeacherTest {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  isPublished: boolean;
  classId: string;
  className?: string;
  gradeSubjectId: string;
  subjectName?: string;
  examTypeId: number;
  examTypeName?: string;
  teacherId: string;
  createdAt: string;
  questions: TestQuestion[];
}

interface TestRow {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  is_published: boolean;
  class_id: string;
  grade_subject_id: string;
  exam_type_id: number;
  teacher_id: string;
  created_at: string;
  classes?: { name: string } | { name: string }[] | null;
  grade_subjects?:
    | {
        subjects_master: { name: string } | { name: string }[] | null;
      }
    | {
        subjects_master: { name: string } | { name: string }[] | null;
      }[]
    | null;
  exam_types?: { name: string } | { name: string }[] | null;
}

interface CreateTestParams {
  title: string;
  description?: string;
  durationMinutes: number;
  isPublished: boolean;
  classId: string;
  gradeSubjectId: string;
  examTypeId: number;
  teacherId: string;
  questions: {
    text: string;
    options: string[];
    correctOptionIndex: number;
    marks: number;
    chapter: string;
    topic: string;
  }[];
}

// Get grade_subject_id from class_id and subject name
export const getGradeSubjectIdBySubjectName = async (
  classId: string,
  subjectName: string
): Promise<string | null> => {
  // First get the class to get grade_level_id
  const { data: classData, error: classError } = await supabase
    .from("classes")
    .select("grade_level_id")
    .eq("id", classId)
    .single();

  if (classError || !classData) {
    console.error("Error fetching class:", classError);
    return null;
  }

  // Then get grade_subject_id by matching subject name
  const { data: gradeSubjects, error: subjectsError } = await supabase
    .from("grade_subjects")
    .select(
      `
      id,
      subjects_master ( name )
    `
    )
    .eq("grade_level_id", classData.grade_level_id);

  if (subjectsError || !gradeSubjects) {
    console.error("Error fetching grade subjects:", subjectsError);
    return null;
  }

  const matchedSubject = gradeSubjects.find((gs: any) => {
    const master = Array.isArray(gs.subjects_master)
      ? gs.subjects_master[0]
      : gs.subjects_master;
    return master?.name === subjectName;
  });

  return matchedSubject?.id || null;
};

// Get exam_type_id from exam type name
export const getExamTypeIdByName = async (
  examTypeName: string
): Promise<number | null> => {
  const { data, error } = await supabase
    .from("exam_types")
    .select("id")
    .eq("name", examTypeName)
    .single();

  if (error || !data) {
    console.error("Error fetching exam type:", error);
    return null;
  }

  return data.id;
};

// Create test with questions and options
export const createTeacherTest = async (
  params: CreateTestParams
): Promise<TeacherTest> => {
  const {
    title,
    description,
    durationMinutes,
    isPublished,
    classId,
    gradeSubjectId,
    examTypeId,
    teacherId,
    questions,
  } = params;

  // Create test
  const { data: testData, error: testError } = await supabase
    .from("tests")
    .insert({
      title,
      description: description || null,
      duration_minutes: durationMinutes,
      is_published: isPublished,
      class_id: classId,
      grade_subject_id: gradeSubjectId,
      exam_type_id: examTypeId,
      teacher_id: teacherId,
    })
    .select("id, created_at")
    .single();

  if (testError || !testData) {
    console.error("Error creating test:", testError);
    throw new Error("Failed to create test.");
  }

  const testId = testData.id;

  // Create questions and options
  for (const question of questions) {
    const { data: questionData, error: questionError } = await supabase
      .from("questions")
      .insert({
        test_id: testId,
        question_text: question.text,
        marks: question.marks,
        chapter: question.chapter,
        topic: question.topic,
        correct_option_index: question.correctOptionIndex,
      })
      .select("id")
      .single();

    if (questionError || !questionData) {
      console.error("Error creating question:", questionError);
      throw new Error("Failed to create question.");
    }

    const questionId = questionData.id;

    // Create options
    const optionsToInsert = question.options
      .map((optionText, index) => ({
        question_id: questionId,
        option_index: index,
        option_text: optionText,
      }))
      .filter((opt) => opt.option_text.trim() !== "");

    if (optionsToInsert.length > 0) {
      const { error: optionsError } = await supabase
        .from("question_options")
        .insert(optionsToInsert);

      if (optionsError) {
        console.error("Error creating options:", optionsError);
        throw new Error("Failed to create question options.");
      }
    }
  }

  // Fetch the complete test
  return getTeacherTest(testId, teacherId);
};

// Get test by ID with questions and options (filtered by teacher_id for security)
export const getTeacherTest = async (
  testId: string,
  teacherId: string
): Promise<TeacherTest> => {
  const { data: testData, error: testError } = await supabase
    .from("tests")
    .select(
      `
      id,
      title,
      description,
      duration_minutes,
      is_published,
      class_id,
      grade_subject_id,
      exam_type_id,
      teacher_id,
      created_at,
      classes ( name ),
      grade_subjects (
        subjects_master ( name )
      ),
      exam_types ( name )
    `
    )
    .eq("id", testId)
    .eq("teacher_id", teacherId)
    .single();

  if (testError || !testData) {
    console.error("Error fetching test:", testError);
    throw new Error("Failed to load test or test not found.");
  }

  const test = testData as TestRow;

  // Fetch questions
  const { data: questionsData, error: questionsError } = await supabase
    .from("questions")
    .select("id, question_text, marks, chapter, topic, correct_option_index")
    .eq("test_id", testId);

  if (questionsError) {
    console.error("Error fetching questions:", questionsError);
    throw new Error("Failed to load questions.");
  }

  const questions: TestQuestion[] = [];

  // Fetch options for each question
  for (const question of questionsData || []) {
    const { data: optionsData, error: optionsError } = await supabase
      .from("question_options")
      .select("option_index, option_text")
      .eq("question_id", question.id)
      .order("option_index", { ascending: true });

    if (optionsError) {
      console.error("Error fetching options:", optionsError);
      continue;
    }

    const options = (optionsData || []).map((opt) => opt.option_text);

    questions.push({
      id: question.id,
      text: question.question_text,
      options,
      correctOptionIndex: question.correct_option_index,
      marks: question.marks,
      chapter: question.chapter,
      topic: question.topic,
    });
  }

  const className = Array.isArray(test.classes)
    ? test.classes[0]?.name
    : test.classes?.name;

  let subjectName: string | undefined;
  if (test.grade_subjects) {
    const gradeSubject = Array.isArray(test.grade_subjects)
      ? test.grade_subjects[0]
      : test.grade_subjects;
    if (gradeSubject) {
      const master = Array.isArray(gradeSubject.subjects_master)
        ? gradeSubject.subjects_master[0]
        : gradeSubject.subjects_master;
      subjectName = master?.name;
    }
  }

  const examTypeName = Array.isArray(test.exam_types)
    ? test.exam_types[0]?.name
    : test.exam_types?.name;

  return {
    id: test.id,
    title: test.title,
    description: test.description || undefined,
    durationMinutes: test.duration_minutes,
    isPublished: test.is_published,
    classId: test.class_id,
    className,
    gradeSubjectId: test.grade_subject_id,
    subjectName,
    examTypeId: test.exam_type_id,
    examTypeName,
    teacherId: test.teacher_id,
    createdAt: test.created_at,
    questions,
  };
};

// Get all tests for a teacher
export const getTeacherTests = async (
  teacherId: string
): Promise<TeacherTest[]> => {
  const { data: testsData, error: testsError } = await supabase
    .from("tests")
    .select(
      `
      id,
      title,
      description,
      duration_minutes,
      is_published,
      class_id,
      grade_subject_id,
      exam_type_id,
      teacher_id,
      created_at,
      classes ( name ),
      grade_subjects (
        subjects_master ( name )
      ),
      exam_types ( name )
    `
    )
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false });

  if (testsError) {
    console.error("Error fetching tests:", testsError);
    throw new Error("Failed to load tests.");
  }

  if (!testsData) {
    return [];
  }

  // Get question counts for each test
  const testsWithCounts = await Promise.all(
    testsData.map(async (test: any) => {
      const { count } = await supabase
        .from("questions")
        .select("*", { count: "exact", head: true })
        .eq("test_id", test.id);

      const questionCount = count || 0;

      const className = Array.isArray(test.classes)
        ? test.classes[0]?.name
        : test.classes?.name;

      let subjectName: string | undefined;
      if (test.grade_subjects) {
        const gradeSubject = Array.isArray(test.grade_subjects)
          ? test.grade_subjects[0]
          : test.grade_subjects;
        if (gradeSubject) {
          const master = Array.isArray(gradeSubject.subjects_master)
            ? gradeSubject.subjects_master[0]
            : gradeSubject.subjects_master;
          subjectName = master?.name;
        }
      }

      const examTypeName = Array.isArray(test.exam_types)
        ? test.exam_types[0]?.name
        : test.exam_types?.name;

      return {
        id: test.id,
        title: test.title,
        description: test.description || undefined,
        durationMinutes: test.duration_minutes,
        isPublished: test.is_published,
        classId: test.class_id,
        className,
        gradeSubjectId: test.grade_subject_id,
        subjectName,
        examTypeId: test.exam_type_id,
        examTypeName,
        teacherId: test.teacher_id,
        createdAt: test.created_at,
        questions: Array(questionCount)
          .fill(null)
          .map((_, i) => ({
            id: `placeholder-${i}`,
            text: "",
            options: [],
            correctOptionIndex: 0,
            marks: 0,
            chapter: "",
            topic: "",
          })) as TestQuestion[], // Placeholder array for count
      };
    })
  );

  return testsWithCounts;
};

// Update test
export const updateTeacherTest = async (
  testId: string,
  params: CreateTestParams
): Promise<TeacherTest> => {
  const {
    title,
    description,
    durationMinutes,
    isPublished,
    classId,
    gradeSubjectId,
    examTypeId,
    teacherId,
    questions,
  } = params;

  // Update test
  const { error: testError } = await supabase
    .from("tests")
    .update({
      title,
      description: description || null,
      duration_minutes: durationMinutes,
      is_published: isPublished,
      class_id: classId,
      grade_subject_id: gradeSubjectId,
      exam_type_id: examTypeId,
    })
    .eq("id", testId)
    .eq("teacher_id", teacherId);

  if (testError) {
    console.error("Error updating test:", testError);
    throw new Error("Failed to update test.");
  }

  // Delete existing questions (cascade will delete options)
  const { error: deleteError } = await supabase
    .from("questions")
    .delete()
    .eq("test_id", testId);

  if (deleteError) {
    console.error("Error deleting old questions:", deleteError);
    throw new Error("Failed to update questions.");
  }

  // Create new questions and options
  for (const question of questions) {
    const { data: questionData, error: questionError } = await supabase
      .from("questions")
      .insert({
        test_id: testId,
        question_text: question.text,
        marks: question.marks,
        chapter: question.chapter,
        topic: question.topic,
        correct_option_index: question.correctOptionIndex,
      })
      .select("id")
      .single();

    if (questionError || !questionData) {
      console.error("Error creating question:", questionError);
      throw new Error("Failed to create question.");
    }

    const questionId = questionData.id;

    // Create options
    const optionsToInsert = question.options
      .map((optionText, index) => ({
        question_id: questionId,
        option_index: index,
        option_text: optionText,
      }))
      .filter((opt) => opt.option_text.trim() !== "");

    if (optionsToInsert.length > 0) {
      const { error: optionsError } = await supabase
        .from("question_options")
        .insert(optionsToInsert);

      if (optionsError) {
        console.error("Error creating options:", optionsError);
        throw new Error("Failed to create question options.");
      }
    }
  }

  // Fetch the complete test
  return getTeacherTest(testId, teacherId);
};

// Publish/Unpublish test
export const publishTeacherTest = async (
  testId: string,
  teacherId: string,
  isPublished: boolean
): Promise<void> => {
  const { error } = await supabase
    .from("tests")
    .update({ is_published: isPublished })
    .eq("id", testId)
    .eq("teacher_id", teacherId);

  if (error) {
    console.error("Error publishing test:", error);
    throw new Error("Failed to update test status.");
  }
};

// Delete test
export const deleteTeacherTest = async (
  testId: string,
  teacherId: string
): Promise<void> => {
  const { error } = await supabase
    .from("tests")
    .delete()
    .eq("id", testId)
    .eq("teacher_id", teacherId);

  if (error) {
    console.error("Error deleting test:", error);
    throw new Error("Failed to delete test.");
  }
};

// ==================== VOICE NOTES ====================

export interface TeacherVoiceNote {
  id: string;
  title: string;
  storageUrl: string;
  storagePath: string;
  durationSeconds: number;
  fileSizeBytes: number;
  className: string;
  subjectName: string;
  createdAt: string;
  size?: string;
}

interface VoiceNoteRow {
  id: string;
  title: string;
  storage_url: string;
  duration_seconds: number;
  file_size_bytes: number;
  created_at: string;
  classes: NamedEntity | NamedEntity[] | null;
  grade_subjects:
    | {
        subjects_master: NamedEntity | NamedEntity[] | null;
      }
    | {
        subjects_master: NamedEntity | NamedEntity[] | null;
      }[]
    | null;
}

interface UploadVoiceNoteParams {
  file: File | Blob;
  title: string;
  classId: string;
  gradeSubjectId: string;
  teacherId: string;
  durationSeconds: number;
}

const mapVoiceNoteRecord = (record: VoiceNoteRow): TeacherVoiceNote => {
  const { data: publicUrlData } = supabase.storage
    .from(VOICE_NOTES_BUCKET)
    .getPublicUrl(record.storage_url);

  const className = resolveName(record.classes);

  let subjectName: string | undefined;
  if (Array.isArray(record.grade_subjects)) {
    subjectName = resolveName(record.grade_subjects[0]?.subjects_master);
  } else {
    subjectName = resolveName(record.grade_subjects?.subjects_master);
  }

  return {
    id: record.id,
    title: record.title,
    storageUrl: publicUrlData.publicUrl,
    storagePath: record.storage_url,
    durationSeconds: record.duration_seconds,
    fileSizeBytes: record.file_size_bytes,
    className: className ?? "Unknown Class",
    subjectName: subjectName ?? "Unknown Subject",
    createdAt: record.created_at,
    size: `${(record.file_size_bytes / (1024 * 1024)).toFixed(2)} MB`,
  };
};

// Get all voice notes for a teacher
export const getTeacherVoiceNotes = async (
  teacherId: string
): Promise<TeacherVoiceNote[]> => {
  const { data, error } = await supabase
    .from("voice_notes")
    .select(
      `
      id,
      title,
      storage_url,
      duration_seconds,
      file_size_bytes,
      created_at,
      classes ( id, name ),
      grade_subjects (
        subjects_master ( name )
      )
    `
    )
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching voice notes:", error);
    throw new Error("Failed to load voice notes.");
  }

  if (!data) {
    return [];
  }

  return data.map((record) => mapVoiceNoteRecord(record as VoiceNoteRow));
};

// Upload voice note
export const uploadTeacherVoiceNote = async (
  params: UploadVoiceNoteParams
): Promise<TeacherVoiceNote> => {
  const { file, teacherId, classId, gradeSubjectId, title, durationSeconds } =
    params;

  // Validate file type (audio files)
  const validAudioTypes = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    "audio/webm",
    "audio/mp4",
  ];
  const isValidAudio =
    file instanceof File
      ? validAudioTypes.includes(file.type) || file.type.startsWith("audio/")
      : true; // Blob from MediaRecorder is usually webm/mp4

  if (!isValidAudio) {
    throw new Error("Only audio files are allowed.");
  }

  // Check file size (max 50MB for audio)
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    throw new Error("File size must be 50MB or less.");
  }

  const fileExtension =
    file instanceof File ? file.name.split(".").pop() || "webm" : "webm";
  const fileName = `voice-${Date.now()}.${fileExtension}`;
  const filePath = `${teacherId}/${fileName}`;

  const { data: storageData, error: storageError } = await supabase.storage
    .from(VOICE_NOTES_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      contentType: file instanceof File ? file.type : "audio/webm",
      upsert: false,
    });

  if (storageError || !storageData) {
    console.error("Error uploading voice note to storage:", storageError);
    throw new Error("Failed to upload voice note.");
  }

  const { data, error } = await supabase
    .from("voice_notes")
    .insert({
      title,
      class_id: classId,
      grade_subject_id: gradeSubjectId,
      storage_url: storageData.path,
      duration_seconds: durationSeconds,
      file_size_bytes: file.size,
      teacher_id: teacherId,
    })
    .select(
      `
      id,
      title,
      storage_url,
      duration_seconds,
      file_size_bytes,
      created_at,
      classes ( id, name ),
      grade_subjects (
        subjects_master ( name )
      )
    `
    )
    .single();

  if (error || !data) {
    console.error("Error saving voice note metadata:", error);
    // Try to clean up uploaded file if metadata save fails
    await supabase.storage.from(VOICE_NOTES_BUCKET).remove([storageData.path]);
    throw new Error("Failed to save voice note information.");
  }

  return mapVoiceNoteRecord(data as VoiceNoteRow);
};

// Delete voice note
export const deleteTeacherVoiceNote = async (
  voiceNoteId: string,
  storagePath: string,
  teacherId: string
): Promise<void> => {
  // Verify the voice note belongs to the teacher
  const { data: voiceNote, error: verifyError } = await supabase
    .from("voice_notes")
    .select("id, storage_url")
    .eq("id", voiceNoteId)
    .eq("teacher_id", teacherId)
    .single();

  if (verifyError || !voiceNote) {
    throw new Error("Voice note not found or access denied.");
  }

  const normalizedPath = normalizeStoragePath(
    storagePath || voiceNote.storage_url
  );

  if (!normalizedPath) {
    throw new Error("File path missing; cannot delete from storage.");
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from(VOICE_NOTES_BUCKET)
    .remove([normalizedPath]);

  if (storageError) {
    console.error("Error deleting from storage:", storageError);
    throw new Error("Failed to delete voice note from storage.");
  }

  // Delete from database
  const { error: deleteError } = await supabase
    .from("voice_notes")
    .delete()
    .eq("id", voiceNoteId)
    .eq("teacher_id", teacherId);

  if (deleteError) {
    console.error("Error deleting voice note record:", deleteError);
    throw new Error("Failed to delete voice note record.");
  }
};

// Attendance-related interfaces and functions
export interface StudentAttendance {
  id: string;
  name: string;
  roll_number: string;
  present: boolean;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  attendance_date: string;
  status: string; // "present" or "absent"
  taken_by: string;
  recorded_at: string;
}

// Get students by class_id for attendance marking
export const getStudentsByClass = async (
  classId: string
): Promise<StudentAttendance[]> => {
  const { data, error } = await supabase
    .from("students")
    .select(
      `
      id,
      roll_number,
      profiles (
        name
      ),
      classes (
        id,
        name
      )
    `
    )
    .eq("class_id", classId)
    .eq("is_active", true)
    .order("roll_number", { ascending: true });

  if (error) {
    console.error("Error fetching students by class:", error);
    throw new Error("Failed to load students for attendance.");
  }

  if (!data) {
    return [];
  }

  return data.map((student: any) => {
    const profile = Array.isArray(student.profiles)
      ? student.profiles[0]
      : student.profiles;

    return {
      id: student.id,
      name: profile?.name || "Unknown Student",
      roll_number: student.roll_number || "",
      present: false, // Default to absent, will be updated from attendance records
    };
  });
};

// Fetch existing attendance records for a specific date and class
export const getAttendanceForDate = async (
  classId: string,
  attendanceDate: string
): Promise<Record<string, boolean>> => {
  const { data, error } = await supabase
    .from("attendance")
    .select("student_id, status")
    .eq("attendance_date", attendanceDate);

  if (error) {
    console.error("Error fetching attendance records:", error);
    return {};
  }

  if (!data) {
    return {};
  }

  const attendanceMap: Record<string, boolean> = {};
  for (const record of data) {
    attendanceMap[record.student_id] = record.status === "present";
  }

  return attendanceMap;
};

// Save attendance records for a date
export const saveAttendance = async (
  classId: string,
  attendanceDate: string,
  students: StudentAttendance[],
  teacherId: string
): Promise<void> => {
  // Delete existing attendance records for this date (to avoid duplicates)
  const { error: deleteError } = await supabase
    .from("attendance")
    .delete()
    .eq("attendance_date", attendanceDate);

  if (deleteError) {
    console.error("Error clearing old attendance:", deleteError);
    throw new Error("Failed to save attendance.");
  }

  // Insert new attendance records
  const attendanceRecords = students.map((student) => ({
    student_id: student.id,
    attendance_date: attendanceDate,
    status: student.present ? "present" : "absent",
    taken_by: teacherId,
    recorded_at: new Date().toISOString(),
  }));

  const { error: insertError } = await supabase
    .from("attendance")
    .insert(attendanceRecords);

  if (insertError) {
    console.error("Error saving attendance records:", insertError);
    throw new Error("Failed to save attendance records.");
  }
};
