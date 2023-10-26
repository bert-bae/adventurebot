import OpenAI from "openai";
import {
  ChatCompletion,
  ChatCompletionCreateParams,
  ImagesResponse,
} from "openai/resources";

export class OpenAiService {
  private client: OpenAI;
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_SECRET,
    });
  }

  public async getPrompt(
    systemPrompt: string,
    prompt: string,
    functions?: ChatCompletionCreateParams.Function[]
  ): Promise<ChatCompletion> {
    const chatCompletion = await this.client.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      model: "gpt-3.5-turbo",
      functions,
      function_call: "auto",
    });
    return chatCompletion;
  }

  public async getImage(prompt: string): Promise<ImagesResponse> {
    const image = await this.client.images.generate({
      prompt,
      n: 1,
      size: "512x512",
    });
    return image;
  }
}
