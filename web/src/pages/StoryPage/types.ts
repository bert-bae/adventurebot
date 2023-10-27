export type StorySectionItem =
  | { story: string; choice?: string }
  | { story?: string; choice: string };
