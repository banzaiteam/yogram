import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentCommandService } from '../../comment-command.service';
import { UpdateCommentDto } from 'apps/libs/Posts/dto/input/update-comment.dto';

export class UpdateCommentCommand {
  constructor(
    public readonly id: string,
    public readonly updateCommentDto: UpdateCommentDto,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentHandler
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private readonly commentCommandService: CommentCommandService) {}
  async execute(command: UpdateCommentCommand): Promise<void> {
    const { id, updateCommentDto } = command;
    return await this.commentCommandService.update(id, updateCommentDto);
  }
}
