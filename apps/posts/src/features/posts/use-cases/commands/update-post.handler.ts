import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostCriteria } from 'apps/libs/Posts/dto/input/update-post-criteria.dto';
import { UpdatePostDto } from 'apps/libs/Posts/dto/input/update-post.dto';
import { PostCommandService } from '../../post-command.service';

export class UpdatePostCommand {
  constructor(
    public readonly criteria: UpdatePostCriteria,
    public readonly updatePostDto: UpdatePostDto,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostCommandHandler
  implements ICommandHandler<UpdatePostCommand>
{
  constructor(private readonly postCommandService: PostCommandService) {}

  async execute({ criteria, updatePostDto }: UpdatePostCommand): Promise<any> {
    await this.postCommandService.update(criteria, updatePostDto);
  }
}
