/**
 * Generated by orval v6.18.1 🍺
 * Do not edit manually.
 * tsoa-example
 * OpenAPI spec version: 1.0.0
 */
import type { N24EnumsStorySectionType } from "./n24EnumsStorySectionType";

export interface TsoaMapStorySection {
  id: string;
  sequence: number;
  type: N24EnumsStorySectionType;
  content: string;
  storyId: string;
  createdAt: string;
}