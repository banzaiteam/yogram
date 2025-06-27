import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostCriteria } from 'apps/libs/Posts/dto/input/update-post-criteria.dto';
import { UpdatePostDto } from '../../../../../../../apps/libs/Posts/dto/input/update-post.dto';
import { PostCommandService } from '../../post-command.service';
import EventEmmiter from 'events';
import { SseEvents } from '../../../../../../../apps/posts/src/constants/sse-events.enum';

export class UpdatePostCommand {
  constructor(
    public readonly criteria: UpdatePostCriteria,
    public readonly updatePostDto: UpdatePostDto,
    public readonly postEmmiter: EventEmmiter,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostCommandHandler
  implements ICommandHandler<UpdatePostCommand>
{
  constructor(private readonly postCommandService: PostCommandService) {}

  async execute({
    criteria,
    updatePostDto,
    postEmmiter,
  }: UpdatePostCommand): Promise<void> {
    const updatedPost = await this.postCommandService.update(
      criteria,
      updatePostDto,
    );
    const updatedFile = updatedPost.files.filter((file) => {
      if (file.id === criteria.fileid) {
        delete file.deletedAt;
        return file;
      }
    });
    postEmmiter.emit(SseEvents.FIleUploaded, updatedFile[0]);
  }
}
