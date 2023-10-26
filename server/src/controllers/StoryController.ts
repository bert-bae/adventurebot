import { Controller, Post, Route, SuccessResponse, Tags, Body } from "tsoa";
import {
  StoryContinueRequest,
  StoryPromptService,
  StoryStartRequest,
} from "../services/StoryPromptService";
import { StoryWithChoices } from "../oaiFunctions/getStoryWithChoices";

@Route("story")
@Tags("Story")
export class StoryController extends Controller {
  private storyService: StoryPromptService;
  constructor() {
    super();
    this.storyService = new StoryPromptService();
  }

  /**
   * Responds with a new story.
   * @returns StoryContent
   */
  @SuccessResponse(201, "Created")
  @Post("")
  public async startStory(
    @Body() body: StoryStartRequest
  ): Promise<StoryWithChoices & { id: string }> {
    const response = await this.storyService.startStory(body);
    return response;
    // return {
    //   id: "test",
    //   story:
    //     "There once was a building that never stopped growing. It started as a simple structure but soon expanded, floor by floor, into a towering monument. People marveled at its size and wondered what could be inside. Some believed it held great treasures, while others feared it held something dark and dangerous. As the building grew taller, the mystery deepened, and the curiosity of the people grew. What should they do next?",
    //   choices: [
    //     {
    //       type: "active",
    //       content: "Investigate the building and uncover its secrets.",
    //     },
    //     {
    //       type: "passive",
    //       content: "Seek guidance from a wise elder about the building",
    //     },
    //     {
    //       type: "neutral",
    //       content: "Ignore the building and hope it eventually stops growing.",
    //     },
    //   ],
    // };
  }

  /**
   * Responds with a continuation of the existing story.
   * @returns StoryContent
   */
  @SuccessResponse(200, "Success")
  @Post("/decision")
  public async decision(
    @Body() body: StoryContinueRequest
  ): Promise<StoryWithChoices> {
    const response = await this.storyService.decision(body);
    return response;
  }
}
