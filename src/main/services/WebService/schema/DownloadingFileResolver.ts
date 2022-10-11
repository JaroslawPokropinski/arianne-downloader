import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { AriaService } from '../../AriaService';
import { DownloadingFile } from './DownloadingFile';
import { FileInput } from './FileInput';

@Service()
@Resolver(DownloadingFile)
export class DownloadingFileResolver {
  constructor(private ariaService: AriaService) {}

  @Query(() => [DownloadingFile])
  files() {
    return this.ariaService.getFiles();
  }

  @Mutation(() => DownloadingFile)
  downloadFile(@Arg('file') fileData: FileInput): Promise<DownloadingFile> {
    return this.ariaService.download(fileData);
  }

  @Mutation(() => DownloadingFile)
  showInFolder(@Arg('fileId') fileId: string): Promise<DownloadingFile> {
    return this.ariaService.showInFolder(fileId);
  }
}
