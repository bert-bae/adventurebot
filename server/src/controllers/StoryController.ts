import {
  Controller,
  Post,
  Route,
  SuccessResponse,
  Tags,
  Body,
  Security,
  Request,
} from "tsoa";
import {
  StoryContinueRequest,
  StoryPromptService,
  StoryStartRequest,
} from "../services/StoryPromptService";
import { StoryWithChoices } from "../oaiFunctions/getStoryWithChoices";
import { ExtendedRequest } from "../utils/types/request.type";
import { storyProgressionWf } from "../temporal/client";

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
  @Security("jwt")
  @Post("")
  public async startStory(
    @Request() req: ExtendedRequest,
    @Body() body: StoryStartRequest
  ): Promise<StoryWithChoices & { id: string }> {
    const user = req.user;
    const response = await this.storyService.startStory(user.id, body);
    await storyProgressionWf(user.id, response.id);
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

  /**
   * Finishes generating the story and choices and creates the workflow process to mark the story as published.
   * @returns StoryContent
   */
  @SuccessResponse(201, "Created")
  @Security("jwt")
  @Post("/{id}")
  public async endStory(
    @Request() req: ExtendedRequest,
    id: string
  ): Promise<void> {
    const user = req.user;
    await this.storyService.finish(id);
  }
}
