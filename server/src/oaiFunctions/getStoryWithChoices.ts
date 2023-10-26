import { ChatCompletionCreateParams } from "openai/resources";

export type StoryWithChoices = {
  story: string;
  choices: Array<{
    type: "active" | "passive" | "neutral";
    content: string;
  }>;
};

const schema: ChatCompletionCreateParams.Function = {
  name: "getStoryWithChoices",
  description:
    "List of choices to provide to a user for how to proceed with their story.",
  parameters: {
    type: "object",
    properties: {
      story: {
        type: "string",
        description:
          "The section of the story where a decision needs to be made to determine how it should continue.",
      },
      choices: {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["active", "passive", "neutral"],
              description:
                "The type of choice that will determine if the decision will progress the story in a certain tone.",
            },
            content: {
              type: "string",
              description: "An explanation of the choice being made.",
            },
          },
        },
      },
    },
    required: ["story", "choices"],
  },
};

const call = (args: StoryWithChoices): StoryWithChoices => {
  return args;
};

export default {
  call,
  schema,
};
