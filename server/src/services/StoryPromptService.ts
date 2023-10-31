import { ChatCompletion } from "openai/resources";
import { OpenAiService } from "./OpenAiService";
import getStoryWithChoices, {
  StoryWithChoices,
} from "../oaiFunctions/getStoryWithChoices";
import { StoriesModel } from "../models/StoriesModel";
import { sendSignal, workflowIds } from "../temporal/client";
import { stopStory } from "../temporal/workflows";
import { Prisma } from "@prisma/client";

export enum StoryEvents {
  Start = "Start",
  Decision = "Decision",
  Continue = "Continue",
  End = "End",
}

export type StoryStartRequest = {
  title: string;
  story: string;
};

export type StoryContinueRequest = {
  id: string;
  decision: string;
};

export type StoryEndRequest = {
  id: string;
  ending: string;
};

export type StoryContent = {
  content: string;
};

export class StoryPromptService {
  private oai: OpenAiService;
  private storiesModel: StoriesModel;
  private basePrompt: string;
  constructor() {
    this.basePrompt =
      "You are a story teller that lets users decide how to continue the story. Your responses should be less than 100 words. As a story teller, you wait for the user's input on how to continue the story. Once you receive the user's decision, you respond with a continuation of the story that takes into consideration the user's latest decision.";
    this.oai = new OpenAiService();
    this.storiesModel = new StoriesModel();
  }

  public async get(id: string) {
    return this.storiesModel.get(id);
  }

  public async list(where: Prisma.StoryWhereInput) {
    const stories = await this.storiesModel.list(where);
    return stories;
  }

  public async startStory(
    authorId: string,
    storyStart: StoryStartRequest
  ): Promise<StoryWithChoices & { id: string }> {
    const chatCompletion = await this.oai.getPrompt(
      this.basePrompt,
      this.createStartPrompt(storyStart)
      // [getStoryWithChoices.schema]
    );

    const result = this.constructResponse(chatCompletion);
    storyStart.story = result.story;
    const { id } = await this.storiesModel.create({ ...storyStart, authorId });
    return {
      ...result,
      id,
    };
  }

  public async decision(
    request: StoryContinueRequest
  ): Promise<StoryWithChoices> {
    const sections = await this.storiesModel.getSections(request.id);
    const storyProgression = sections.reduce((prev, next) => {
      if (next.type === "STORY") {
        prev += next.content;
      }
      return prev;
    }, "");
    const prompt = this.createDecisionPrompt(
      storyProgression,
      request.decision
    );

    const chatCompletion = await this.oai.getPrompt(
      this.basePrompt,
      prompt
      // [getStoryWithChoices.schema]
    );
    const response = this.constructResponse(chatCompletion);
    await this.storiesModel.addSections(request.id, {
      choice: request.decision,
      story: response.story,
    });
    return response;
  }

  public async finish(storyId: string) {
    await this.storiesModel.update(storyId, {
      published: true,
    });
    await sendSignal(workflowIds.story(storyId), stopStory.signal, true);
  }

  private constructResponse(completion: ChatCompletion): StoryWithChoices {
    let result;
    if (completion.choices[0].message.function_call) {
      const parsed = JSON.parse(
        completion.choices[0].message.function_call.arguments
      );
      result = getStoryWithChoices.call(parsed as StoryWithChoices);
    } else {
      result = {
        story: completion.choices[0].message.content!,
        choices: [],
      };
    }
    return result;
  }

  private createStartPrompt(request: StoryStartRequest): string {
    return `This story is called "${request.title}" and it is about the following premise:\n${request.story}`;
  }

  private createDecisionPrompt(story: string, decision: string): string {
    return `Continue the following story:\n\n${story}. ${decision}.`;
  }
}
