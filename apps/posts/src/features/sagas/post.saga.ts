import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { map, Observable } from 'rxjs';
import { DeletePostEvent } from '../posts/use-cases/events/delete-post.event';
import { DeletePostCommand } from '../posts/use-cases/commands/delete-post.handler';

@Injectable()
export class PostSagas {
  @Saga()
  deletePost = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(DeletePostEvent),
      map(
        (event) =>
          new DeletePostCommand(
            event.postId,
            event.folderPath,
            event.path,
            event.host,
          ),
      ),
    );
  };
}
