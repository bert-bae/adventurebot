import { ChatCompletion } from "openai/resources";
import { OpenAiService } from "./OpenAiService";
import getStoryWithChoices, {
  StoryWithChoices,
} from "../oaiFunctions/getStoryWithChoices";
import { StoriesModel } from "../models/StoriesModel";

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
      "You are a story teller that lets users decide how to continue the story. Your responses should be less than 100 words. Provide 3 choices on how the user should continue the user's story by using the function getStoryWithChoices({story: string, choices: Array<{ type, content }> }).";
    this.oai = new OpenAiService();
    this.storiesModel = new StoriesModel();
  }

  public async startStory(
    authorId: string,
    storyStart: StoryStartRequest
  ): Promise<StoryWithChoices & { id: string }> {
    const chatCompletion = await this.oai.getPrompt(
      this.basePrompt,
      this.createStartPrompt(storyStart),
      [getStoryWithChoices.schema]
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

    const chatCompletion = await this.oai.getPrompt(this.basePrompt, prompt, [
      getStoryWithChoices.schema,
    ]);
    const response = this.constructResponse(chatCompletion);
    await this.storiesModel.update(request.id, {
      choice: request.decision,
      story: response.story,
    });
    return response;
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
