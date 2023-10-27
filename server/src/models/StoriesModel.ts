import { nanoid } from "nanoid";
import { StoryStartRequest } from "../services/StoryPromptService";
import { prisma } from "../db/pg";

export class StoriesModel {
  private prisma: typeof prisma;
  constructor() {
    this.prisma = prisma;
  }

  public async get(id: string) {
    const stories = await this.prisma.story.findUnique({
      where: { id },
      include: { StorySection: true },
    });
    console.log("stories", JSON.stringify(stories));
    return [{ story: "", choice: "" }];
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

  public update(id: string, value: { story?: string; choice?: string }) {
    // console.log("update", this.inMemoryDatabase);
    // if (!this.inMemoryDatabase.get(id)) {
    //   throw new Error("Missing story with ID: " + id);
    // }
    // const dbVal = this.inMemoryDatabase.get(id) as [];
    // this.inMemoryDatabase.update(id, [...dbVal, value]);
  }
}
