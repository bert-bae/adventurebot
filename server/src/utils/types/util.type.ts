export type TsoaMap<T> = {
  [P in keyof T]: T[P];
};
