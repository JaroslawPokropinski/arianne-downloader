import { Field, InputType } from 'type-graphql';

@InputType()
export class FileInput {
  @Field()
  linkUrl!: string;

  @Field()
  pageUrl!: string;
}
