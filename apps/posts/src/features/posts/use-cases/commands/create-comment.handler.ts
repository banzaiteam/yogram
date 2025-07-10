import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentDto } from 'apps/libs/Posts/dto/input/create-comment.dto';
import { CommentCommandService } from '../../comment-command.service';

export class CreateCommentCommand {
  constructor(public readonly createCommentDto: CreateCommentDto) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(private readonly commentCommandService: CommentCommandService) {}
  async execute({ createCommentDto }: CreateCommentCommand): Promise<any> {
    // todo check if post is published
    return await this.commentCommandService.create(createCommentDto);
  }
}
