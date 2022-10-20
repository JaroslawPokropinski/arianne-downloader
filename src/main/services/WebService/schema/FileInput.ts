import { Field, InputType } from 'type-graphql';

@InputType('FileInput')
export class FileInput {
  @Field()
  linkUrl!: string;

  @Field()
  pageUrl!: string;
}
