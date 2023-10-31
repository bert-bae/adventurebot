import { Story, StorySection } from "@prisma/client";
import { TsoaMap } from "../utils/types/util.type";

export type StorySchema = TsoaMap<Story>;
export type StorySectionSchema = Omit<TsoaMap<StorySection>, "type"> & {
  type: "CHOICE" | "STORY";
};
