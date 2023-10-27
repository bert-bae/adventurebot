import { nanoid } from "nanoid";
import { StoryStartRequest } from "../services/StoryPromptService";
import { prisma } from "../db/pg";

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

  public async create(story: StoryStartRequest) {
    const storyId = nanoid();
    await this.prisma.$transaction([
      this.prisma.story.create({
        data: { id: storyId, title: story.title, authorId: "1" },
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

  public async update(
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
}
