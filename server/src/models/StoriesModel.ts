import { nanoid } from "nanoid";
import { StoryStartRequest } from "../services/StoryPromptService";
import { prisma } from "../db/pg";
import { Story } from "@prisma/client";

export type UpdateStoryRequest = Partial<Omit<Story, "id" | "authorId">>;
export class StoriesModel {
  private prisma: typeof prisma;
  constructor() {
    this.prisma = prisma;
  }

  public async get(id: string) {
    const story = await this.prisma.story.findUnique({
      where: { id },
      include: { StorySection: true },
    });
    if (!story) {
      throw new Error("Story does not exist");
    }

    return story;
  }

  public async getSections(storyId: string) {
    const sections = await this.prisma.storySection.findMany({
      where: { storyId },
      orderBy: {
        sequence: "asc",
      },
    });
    return sections;
  }

  public async create(story: StoryStartRequest & { authorId: string }) {
    const storyId = nanoid();
    await this.prisma.$transaction([
      this.prisma.story.create({
        data: { id: storyId, title: story.title, authorId: story.authorId },
      }),
      this.prisma.storySection.create({
        data: {
          id: nanoid(),
          storyId,
          content: story.story,
          type: "STORY",
        },
      }),
    ]);
    return { id: storyId };
  }

  public async addSections(
    storyId: string,
    value: { choice: string; story: string }
  ) {
    await this.prisma.$transaction([
      this.prisma.storySection.create({
        data: {
          id: nanoid(),
          storyId,
          content: value.choice!,
          type: "CHOICE",
        },
      }),
      this.prisma.storySection.create({
        data: {
          id: nanoid(),
          storyId,
          content: value.story!,
          type: "STORY",
        },
      }),
    ]);
  }

  public async update(storyId: string, values: UpdateStoryRequest) {
    await this.prisma.story.update({
      data: values,
      where: { id: storyId },
    });
  }
}
