export class DeletePostEvent {
  constructor(
    public readonly userId: string,
    public readonly postId: string,
  ) {}
}
