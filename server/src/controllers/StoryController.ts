import {
  Controller,
  Post,
  Route,
  SuccessResponse,
  Tags,
  Body,
  Security,
  Request,
  Get,
} from "tsoa";
import {
  StoryContinueRequest,
  StoryPromptService,
  StoryStartRequest,
} from "../services/StoryPromptService";
import { StoryWithChoices } from "../oaiFunctions/getStoryWithChoices";
import { ExtendedRequest } from "../utils/types/request.type";
import { storyProgressionWf } from "../temporal/client";
import { Story } from "@prisma/client";
import { TsoaMap } from "../utils/types/util.type";

@Route("story")
@Tags("Story")
export class StoryController extends Controller {
  private storyService: StoryPromptService;
  constructor() {
    super();
    this.storyService = new StoryPromptService();
  }

  /**
   * List of all of the user's stories
   * @returns StoryContent[]
   */
  @SuccessResponse(200, "Success")
  @Security("jwt")
  @Get("")
  public async listStories(
    @Request() req: ExtendedRequest
    // Tsoa generator has issues recognizing extended types. This is resolved if we wrap it in a type util that infers it
  ): Promise<TsoaMap<Story>[]> {
    const user = req.user;
    const stories = await this.storyService.list({ authorId: user.id });
    return stories;
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
