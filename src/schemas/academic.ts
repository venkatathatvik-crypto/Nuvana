export interface NestedClass {
  id: string;
  name: string;

  grade_levels:
    | {
        id: number;
        name: string;
      }
    | {
        id: number;
        name: string;
      }[];
}

// 2. Interface for the FLAT Data required by your application
export interface FlattenedClass {
  class_id: string;
  class_name: string;
  grade_id: number;
  grade_name: string;
}

