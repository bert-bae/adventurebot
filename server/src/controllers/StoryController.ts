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
import { getWsConnection } from "../websocket";

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
    getWsConnection(user.id)?.send(
      JSON.stringify({ type: "info", message: "Story created" })
    );
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
