import { nanoid } from "nanoid";
import { StoryStartRequest } from "../services/StoryPromptService";
import { InMemoryDatabase } from "../db/InMemoryDatabase";

export class StoriesModel {
  private inMemoryDatabase: InMemoryDatabase;
  constructor(db: InMemoryDatabase) {
    this.inMemoryDatabase = db;
  }

  public get(id: string) {
    console.log("update", this.inMemoryDatabase);
    return this.inMemoryDatabase.get(id) as {
      story?: string;
      choice?: string;
    }[];
  }

  public create(start: StoryStartRequest) {
    const storyId = nanoid();
    this.inMemoryDatabase.add(storyId, [
      {
        story: start.story,
      },
    ]);
    return { id: storyId };
  }

  public update(id: string, value: { story?: string; choice?: string }) {
    console.log("update", this.inMemoryDatabase);
    if (!this.inMemoryDatabase.get(id)) {
      throw new Error("Missing story with ID: " + id);
    }
    const dbVal = this.inMemoryDatabase.get(id) as [];
    this.inMemoryDatabase.update(id, [...dbVal, value]);
  }
}
