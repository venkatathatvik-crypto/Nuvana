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
