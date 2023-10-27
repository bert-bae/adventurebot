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
