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
  email: string;
  authorId: string;
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
      "You are a story teller that lets users decide how to continue the story. After each decision, you extend the story by 100 words and provide 3 choices on how the user should continue the story. Always use the function call getStoryWithChoices({story: string, choices: Array<{ type, content }> }).";
    this.oai = new OpenAiService();
    this.storiesModel = new StoriesModel();
  }

  public async startStory(
    request: StoryStartRequest
  ): Promise<StoryWithChoices & { id: string }> {
    const chatCompletion = await this.oai.getPrompt(
      this.basePrompt,
      this.createStartPrompt(request),
      [getStoryWithChoices.schema]
    );

    const result = this.constructResponse(chatCompletion);
    const { id } = await this.storiesModel.create(request);
    return {
      ...result,
      id,
    };
  }

  public async decision(
    request: StoryContinueRequest
  ): Promise<StoryWithChoices> {
    const story = (await this.storiesModel.get(request.id)).reduce(
      (prev, next) => {
        prev += next.story;
        return prev;
      },
      ""
    );
    const prompt = this.createDecisionPrompt(story, request.decision);
    const chatCompletion = await this.oai.getPrompt(this.basePrompt, prompt, [
      getStoryWithChoices.schema,
    ]);
    this.storiesModel.update(request.id, { choice: request.decision });
    return this.constructResponse(chatCompletion);
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
        choices: [{ type: "passive", content: "Continue" }],
      };
    }
    return result;
  }

  private createStartPrompt(request: StoryStartRequest): string {
    return `This story is called "${request.title}" and it is about the following premise:\n${request.story}`;
  }

  private createDecisionPrompt(story: string, decision: string): string {
    return `${story}\n User makes the following decision: "${decision}". Continue the story.`;
  }
}
