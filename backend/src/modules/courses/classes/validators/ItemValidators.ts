import {Type} from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsUrl,
  Matches,
  IsNumber,
  IsPositive,
  Min,
  Max,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsEmpty,
  IsDecimal,
  IsMongoId,
  ValidateIf,
  ValidateNested,
  IsEnum,
  IsArray,
} from 'class-validator';
import {JSONSchema} from 'class-validator-jsonschema';
import {CourseVersion} from '../transformers/CourseVersion.js';
import {ItemRef, ItemsGroup} from '../transformers/Item.js';
import {
  IVideoDetails,
  IQuizDetails,
  IBlogDetails,
  IBaseItem,
  ItemType,
  ID,
} from '#root/shared/interfaces/models.js';
import {OnlyOneId} from './customValidators.js';

class VideoDetailsPayloadValidator implements IVideoDetails {
  @JSONSchema({
    title: 'Video URL',
    description: 'Public video URL (e.g., YouTube or Vimeo link)',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    type: 'string',
    format: 'uri',
  })
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  URL: string;

  @JSONSchema({
    title: 'Start Time',
    description: 'Start time of the video clip in HH:MM:SS format',
    example: '00:01:30',
    type: 'string',
  })
  @IsNotEmpty()
  @Matches(/^(\d{1,2}:)?\d{1,2}:\d{2}$/, {
    message: 'Invalid time format, it should be HH:MM:SS',
  })
  startTime: string;

  @JSONSchema({
    title: 'End Time',
    description: 'End time of the video clip in HH:MM:SS format',
    example: '00:10:15',
    type: 'string',
  })
  @IsNotEmpty()
  @Matches(/^(\d{1,2}:)?\d{1,2}:\d{2}$/, {
    message: 'Invalid time format, it should be HH:MM:SS',
  })
  endTime: string;

  @JSONSchema({
    title: 'Video Points',
    description: 'Points assigned to the video interaction',
    example: 10,
    type: 'number',
  })
  @IsNotEmpty()
  @IsNumber()
  points: number;
}

class QuizDetailsPayloadValidator
  implements Omit<IQuizDetails, 'questionBankRefs'>
{
  @JSONSchema({
    title: 'Pass Threshold',
    description: 'Minimum percentage required to pass, between 0 and 1',
    example: 0.7,
    type: 'number',
    minimum: 0,
    maximum: 1,
  })
  @IsPositive()
  @IsNumber()
  @Min(0)
  @Max(1)
  @IsNotEmpty()
  passThreshold: number; // 0-1

  @JSONSchema({
    title: 'Maximum Attempts',
    description:
      'Maximum number of attempts allowed for the quiz, -1 for unlimited',
    example: 3,
    type: 'integer',
    minimum: -1,
  })
  @IsNumber()
  @Min(-1)
  @IsNotEmpty()
  maxAttempts: number;

  @JSONSchema({
    title: 'Quiz Type',
    description: 'Type of quiz: DEADLINE or NO_DEADLINE',
    example: 'DEADLINE',
    type: 'string',
    enum: ['DEADLINE', 'NO_DEADLINE'],
  })
  @IsString()
  @IsNotEmpty()
  quizType: 'DEADLINE' | 'NO_DEADLINE';

  @JSONSchema({
    title: 'Approximate Time to Complete',
    description: 'Approximate time to complete the quiz in HH:MM:SS format',
    example: '00:30:00',
    type: 'string',
  })
  @Matches(/^(\d{1,2}:)?\d{1,2}:\d{2}$/, {
    message: 'Invalid time format, it should be HH:MM:SS',
  })
  @IsNotEmpty()
  approximateTimeToComplete: string;

  @JSONSchema({
    title: 'Allow Partial Grading',
    description:
      'Whether to allow partial grading for questions, particularly for MSQ/SML type of questions.',
    example: true,
    type: 'boolean',
  })
  @IsBoolean()
  @IsNotEmpty()
  allowPartialGrading: boolean;

  @JSONSchema({
    title: 'Allow Hint',
    description: 'Whether to allow students to see the hints for questions',
    example: true,
    type: 'boolean',
  })
  @IsBoolean()
  @IsNotEmpty()
  allowHint: boolean;

  @JSONSchema({
    title: 'Show Correct Answers After Submission',
    description:
      'Whether to return and show correct answers after successful submission of an attempt',
    example: true,
    type: 'boolean',
  })
  @IsBoolean()
  @IsNotEmpty()
  showCorrectAnswersAfterSubmission: boolean;

  @JSONSchema({
    title: 'Show Explanation After Submission',
    description:
      'Whether to return and show explanations for correct answers after successful submission of an attempt',
    example: true,
    type: 'boolean',
  })
  @IsBoolean()
  @IsNotEmpty()
  showExplanationAfterSubmission: boolean;

  @JSONSchema({
    title: 'Show Score After Submission',
    description:
      'Whether to return and show score after successful submission of an attempt',
    example: true,
    type: 'boolean',
  })
  @IsBoolean()
  @IsNotEmpty()
  showScoreAfterSubmission: boolean;

  @JSONSchema({
    title: 'Question Visibility',
    description: 'Number of quiz questions visible to students in an attempt',
    example: 5,
    type: 'integer',
    minimum: 1,
  })
  @IsNotEmpty()
  @IsPositive()
  questionVisibility: number;

  @JSONSchema({
    title: 'Quiz Release Time',
    description: 'ISO date string representing quiz release time',
    example: '2023-10-15T14:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsDateString()
  releaseTime: Date;

  @JSONSchema({
    title: 'Quiz Deadline',
    description: 'ISO date string for quiz deadline',
    example: '2023-10-22T23:59:59Z',
    type: 'string',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  deadline: Date;
}

class BlogDetailsPayloadValidator implements IBlogDetails {
  @JSONSchema({
    title: 'Blog Tags',
    description: 'Tags for categorizing the blog (auto-managed)',
    example: ['programming', 'algorithms'],
    type: 'array',
    items: {
      type: 'string',
    },
    readOnly: true,
  })
  @IsEmpty()
  tags: string[];

  @JSONSchema({
    title: 'Blog Content',
    description: 'Full blog content in markdown or plain text',
    example:
      '# Introduction\n\nThis is a sample blog post about programming...',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @JSONSchema({
    title: 'Blog Points',
    description: 'Points assigned to the blog submission',
    example: 20,
    type: 'number',
  })
  @IsNotEmpty()
  @IsDecimal()
  points: number;

  @JSONSchema({
    title: 'Estimated Read Time',
    description: 'Estimated time to complete reading the blog in minutes',
    example: 15,
    type: 'integer',
    minimum: 1,
  })
  @IsNotEmpty()
  @IsPositive()
  estimatedReadTimeInMinutes: number;
}

class CreateItemBody implements Partial<IBaseItem> {
  @JSONSchema({
    title: 'Item Name',
    description: 'Title of the item',
    example: 'Introduction to Data Structures',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @JSONSchema({
    title: 'Item Description',
    description: 'Description of the item',
    example:
      'Learn about basic data structures like arrays, linked lists, and stacks.',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @JSONSchema({
    title: 'After Item ID',
    description: 'Place item after this item ID',
    example: '60d5ec49b3f1c8e4a8f8b8c3',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  afterItemId?: string;

  @JSONSchema({
    title: 'Before Item ID',
    description: 'Place item before this item ID',
    example: '60d5ec49b3f1c8e4a8f8b8c4',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  beforeItemId?: string;

  @JSONSchema({
    title: 'Item Type',
    description: 'Type of the item: VIDEO, BLOG, or QUIZ',
    example: 'VIDEO',
    type: 'string',
    enum: ['VIDEO', 'BLOG', 'QUIZ'],
  })
  @IsEnum(ItemType)
  @IsNotEmpty()
  type: ItemType;

  @JSONSchema({
    title: 'Video Details',
    description: 'Details specific to video items',
    type: 'object',
  })
  @ValidateIf(o => o.type === ItemType.VIDEO)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => VideoDetailsPayloadValidator)
  videoDetails?: VideoDetailsPayloadValidator;

  @JSONSchema({
    title: 'Blog Details',
    description: 'Details specific to blog items',
    type: 'object',
  })
  @ValidateIf(o => o.type === ItemType.BLOG)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BlogDetailsPayloadValidator)
  blogDetails?: BlogDetailsPayloadValidator;

  @JSONSchema({
    title: 'Quiz Details',
    description: 'Details specific to quiz items',
    type: 'object',
  })
  @ValidateIf(o => o.type === ItemType.QUIZ)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => QuizDetailsPayloadValidator)
  quizDetails?: QuizDetailsPayloadValidator;
}

class UpdateItemBody implements Partial<IBaseItem> {
  @JSONSchema({
    title: 'Item Name',
    description: 'Title of the item',
    example: 'Introduction to Data Structures',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @JSONSchema({
    title: 'Item Description',
    description: 'Description of the item',
    example:
      'Learn about basic data structures like arrays, linked lists, and stacks.',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @JSONSchema({
    title: 'After Item ID',
    description: 'Place item after this item ID',
    example: '60d5ec49b3f1c8e4a8f8b8c3',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  afterItemId?: string;

  @JSONSchema({
    title: 'Before Item ID',
    description: 'Place item before this item ID',
    example: '60d5ec49b3f1c8e4a8f8b8c4',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  beforeItemId?: string;

  @JSONSchema({
    title: 'Item Type',
    description: 'Type of the item: VIDEO, BLOG, or QUIZ',
    example: 'VIDEO',
    type: 'string',
    enum: ['VIDEO', 'BLOG', 'QUIZ'],
  })
  @IsEnum(ItemType)
  @IsNotEmpty()
  type: ItemType;

  @JSONSchema({
    title: 'Video Details',
    description: 'Details specific to video items',
    type: 'object',
  })
  @ValidateIf(o => o.type === ItemType.VIDEO)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => VideoDetailsPayloadValidator)
  videoDetails?: VideoDetailsPayloadValidator;

  @JSONSchema({
    title: 'Blog Details',
    description: 'Details specific to blog items',
    type: 'object',
  })
  @ValidateIf(o => o.type === ItemType.BLOG)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BlogDetailsPayloadValidator)
  blogDetails?: BlogDetailsPayloadValidator;

  @JSONSchema({
    title: 'Quiz Details',
    description: 'Details specific to quiz items',
    type: 'object',
  })
  @ValidateIf(o => o.type === ItemType.QUIZ)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => QuizDetailsPayloadValidator)
  quizDetails?: QuizDetailsPayloadValidator;
}

class MoveItemBody {
  @JSONSchema({
    title: 'After Item ID',
    description: 'Move the item after this item ID',
    example: '60d5ec49b3f1c8e4a8f8b8c3',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  @OnlyOneId({
    afterIdPropertyName: 'afterItemId',
    beforeIdPropertyName: 'beforeItemId',
  })
  afterItemId?: string;

  @JSONSchema({
    title: 'Before Item ID',
    description: 'Move the item before this item ID',
    example: '60d5ec49b3f1c8e4a8f8b8c4',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  beforeItemId?: string;
}

class VersionModuleSectionItemParams {
  @JSONSchema({
    title: 'Version ID',
    description: 'ID of the course version',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  versionId: string;

  @JSONSchema({
    title: 'Module ID',
    description: 'ID of the module',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  moduleId: string;

  @JSONSchema({
    title: 'Section ID',
    description: 'ID of the section',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  sectionId: string;

  @JSONSchema({
    title: 'Item ID',
    description: 'ID of the item',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  itemId: string;
}

class DeleteItemParams {
  @JSONSchema({
    title: 'Items Group ID',
    description: 'ID of the items group containing the item',
    example: '60d5ec49b3f1c8e4a8f8b8g9',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  itemsGroupId: string;

  @JSONSchema({
    title: 'Item ID',
    description: 'ID of the item to delete',
    example: '60d5ec49b3f1c8e4a8f8b8f8',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  itemId: string;
}

class GetItemParams {
  @JSONSchema({
    title: 'Course ID',
    description: 'ID of the course in which user is enrolled',
    example: '60d5ec49b3f1c8e4a8f8b8g9',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  courseId: string;

  @JSONSchema({
    title: 'Course Version ID',
    description: 'ID of the course version containing the item',
    example: '60d5ec49b3f1c8e4a8f8b8f8',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  courseVersionId: string;

  @JSONSchema({
    title: 'Item ID',
    description: 'ID of the item',
    example: '60d5ec49b3f1c8e4a8f8b8f8',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  itemId: string;
}

class ItemNotFoundErrorResponse {
  @JSONSchema({
    description: 'The error message',
    example:
      'No item found with the specified ID. Please verify the ID and try again.',
    type: 'string',
    readOnly: true,
  })
  @IsNotEmpty()
  message: string;
}

class ItemRefResponse implements ItemRef {
  @JSONSchema({
    description: 'The unique identifier of the item',
    type: 'string',
    format: 'Mongo Object ID',
    readOnly: true,
  })
  @IsMongoId()
  @IsOptional()
  _id?: ID;

  @JSONSchema({
    description: 'The name of the item',
    type: 'string',
    readOnly: true,
  })
  @IsNotEmpty()
  @IsEnum(ItemType)
  type: ItemType;

  @JSONSchema({
    description: 'The order of the item',
    type: 'string',
    readOnly: true,
  })
  @IsNotEmpty()
  @IsString()
  order: string;
}

class ItemsGroupResponse implements ItemsGroup {
  @JSONSchema({
    description: 'The unique identifier of the items group',
    type: 'string',
    format: 'Mongo Object ID',
    readOnly: true,
  })
  @IsMongoId()
  @IsOptional()
  _id?: ID;

  @JSONSchema({
    description: 'The list of items in the group',
    type: 'array',
    items: {
      $ref: '#/components/schemas/ItemRefResponse',
    },
    readOnly: true,
  })
  @IsNotEmpty()
  @Type(() => ItemRefResponse)
  @ValidateNested({each: true})
  @IsArray()
  items: ItemRef[];

  @JSONSchema({
    description: 'The ID of the section to which this items group belongs',
    type: 'string',
    format: 'Mongo Object ID',
    readOnly: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  sectionId: ID;
}

class ItemDataResponse {
  @JSONSchema({
    description: 'The item data',
    type: 'object',
    readOnly: true,
    items: { $ref: '#/components/schemas/ItemGroupResponse' }
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ItemsGroupResponse)
  itemsGroup: ItemsGroupResponse;

  @JSONSchema({
    description: 'The updated version data (when applicable)',
    type: 'object',
    readOnly: true,
  })
  @IsOptional()
  version?: CourseVersion;
}

class DeletedItemResponse {
  @JSONSchema({
    description: 'The deleted item data',
    type: 'object',
    readOnly: true,
  })
  @IsNotEmpty()
  deletedItem: Record<string, any>;

  @JSONSchema({
    description: 'The updated items group after deletion',
    type: 'object',
    readOnly: true,
  })
  @IsNotEmpty()
  updatedItemsGroup: Record<string, any>;
}

export {
  CreateItemBody,
  UpdateItemBody,
  MoveItemBody,
  VideoDetailsPayloadValidator,
  QuizDetailsPayloadValidator,
  BlogDetailsPayloadValidator,
  VersionModuleSectionItemParams,
  DeleteItemParams,
  ItemNotFoundErrorResponse,
  ItemDataResponse,
  DeletedItemResponse,
  GetItemParams,
};

export const ITEM_VALIDATORS = [
  CreateItemBody,
  UpdateItemBody,
  MoveItemBody,
  VideoDetailsPayloadValidator,
  QuizDetailsPayloadValidator,
  BlogDetailsPayloadValidator,
  VersionModuleSectionItemParams,
  DeleteItemParams,
  ItemNotFoundErrorResponse,
  ItemDataResponse,
  DeletedItemResponse,
  GetItemParams,
]
