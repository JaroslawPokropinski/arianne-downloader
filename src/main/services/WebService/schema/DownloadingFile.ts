import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class DownloadingFile {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  // @Field()
  path!: string;

  @Field()
  createdDate!: number;

  @Field()
  size!: number;

  @Field()
  downloadedSize!: number;

  @Field()
  status!: 'active' | 'waiting' | 'error' | 'paused' | 'removed' | 'complete';
}
