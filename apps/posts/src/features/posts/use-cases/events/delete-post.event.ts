export class DeletePostEvent {
  constructor(
    public readonly postId: string,
    public readonly folderPath: string,
    public readonly path: string,
    public readonly host: string,
  ) {}
}
