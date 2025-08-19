import { Test, TestingModule } from '@nestjs/testing';
import { CommentCommandService } from './comment-command.service';
import { ICommentCommandRepository } from './interfaces/comment-command-repository.interface';
import { CreateCommentDto } from 'apps/libs/Posts/dto/input/create-comment.dto';
import { ICommentQueryRepository } from './interfaces/comment-query-repository.interface';
import { PostsQueryRepository } from './infrastracture/repository/query/posts-query.repository';

let createCommentDto = {
  postId: 'ae9b752e-732b-4e9c-9eca-e5068cd74e27',
  userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
  text: 'bal-bla4',
  parentId: 'bb20fa4a-b9de-4f45-8dfc-7c8f68d2bc5a',
  post: null,
  likes: 0,
};

const post = {
  id: 'ae9b752e-732b-4e9c-9eca-e5068cd74e27',
  createdAt: '2025-07-12',
  updatedAt: '2025-07-12',
  deletedAt: null,
  userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
  isPublished: false,
  description: null,
  files: [
    {
      id: '2fc29999-9c0f-4244-a132-52cb89e5c991',
      createdAt: '2025-07-12',
      updatedAt: '2025-07-12',
      deletedAt: null,
      fileName: 'DSC03205.JPG',
      url: 'https://yogram-files.s3.eu-north-1.amazonaws.com/dev/posts/fd2dcd81-8c03-4292-923e-6c4fb2543c00/ae9b752e-732b-4e9c-9eca-e5068cd74e27/DSC03205-1752316745742-788214357.JPG',
      metatype: 'image/jpeg',
      status: 'ready',
      postId: 'ae9b752e-732b-4e9c-9eca-e5068cd74e27',
    },
    {
      id: '26fad8a3-6ba9-4404-9b75-f8f4a3971643',
      createdAt: '2025-07-12',
      updatedAt: '2025-07-12',
      deletedAt: null,
      fileName: 'DSC03205.JPG',
      url: null,
      metatype: 'image/jpeg',
      status: 'pending',
      postId: 'ae9b752e-732b-4e9c-9eca-e5068cd74e27',
    },
    {
      id: '68893afb-255b-44f5-a373-c9fa6f9510ce',
      createdAt: '2025-07-12',
      updatedAt: '2025-07-12',
      deletedAt: null,
      fileName: 'DSC03265.JPG',
      url: 'https://yogram-files.s3.eu-north-1.amazonaws.com/dev/posts/fd2dcd81-8c03-4292-923e-6c4fb2543c00/ae9b752e-732b-4e9c-9eca-e5068cd74e27/DSC03265-1752316745851-694061699.JPG',
      metatype: 'image/jpeg',
      status: 'ready',
      postId: 'ae9b752e-732b-4e9c-9eca-e5068cd74e27',
    },
    {
      id: '0b1d816b-adac-4bbd-9411-2b6861edd720',
      createdAt: '2025-07-12',
      updatedAt: '2025-07-12',
      deletedAt: null,
      fileName: 'DSC03265.JPG',
      url: 'https://yogram-files.s3.eu-north-1.amazonaws.com/dev/posts/fd2dcd81-8c03-4292-923e-6c4fb2543c00/ae9b752e-732b-4e9c-9eca-e5068cd74e27/DSC03265-1752316745811-240447171.JPG',
      metatype: 'image/jpeg',
      status: 'ready',
      postId: 'ae9b752e-732b-4e9c-9eca-e5068cd74e27',
    },
  ],
  comments: [
    {
      id: 'bb20fa4a-b9de-4f45-8dfc-7c8f68d2bc5a',
      createdAt: '2025-07-12',
      updatedAt: '2025-07-12',
      deletedAt: null,
      userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
      text: 'bal-bla',
      likes: 0,
      parentId: null,
    },
    {
      id: '28af7db0-8603-43c7-9dde-e69161a40cc3',
      createdAt: '2025-07-12',
      updatedAt: '2025-07-12',
      deletedAt: null,
      userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
      text: 'bal-bla2',
      likes: 0,
      parentId: null,
    },
    {
      id: 'd557d108-25b4-4c38-ae2d-265f6ac6309b',
      createdAt: '2025-07-12',
      updatedAt: '2025-07-12',
      deletedAt: null,
      userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
      text: 'bal-bla3',
      likes: 0,
      parentId: 'bb20fa4a-b9de-4f45-8dfc-7c8f68d2bc5a',
    },
    {
      id: '2913d1ae-a788-489b-80cb-831bdd888288',
      createdAt: '2025-07-12',
      updatedAt: '2025-07-12',
      deletedAt: null,
      userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
      text: 'bal-bla4',
      likes: 0,
      parentId: 'bb20fa4a-b9de-4f45-8dfc-7c8f68d2bc5a',
    },
    {
      id: 'e0897999-558c-4359-a552-c81264197293',
      createdAt: '2025-07-12',
      updatedAt: '2025-07-12',
      deletedAt: null,
      userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
      text: 'bal-bla4',
      likes: 0,
      parentId: 'bb20fa4a-b9de-4f45-8dfc-7c8f68d2bc5a',
    },
    {
      id: 'bf25fff8-3b82-4615-ab34-b756eff8868e',
      createdAt: '2025-07-12',
      updatedAt: '2025-07-12',
      deletedAt: null,
      userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
      text: 'bal-bla4',
      likes: 0,
      parentId: 'bb20fa4a-b9de-4f45-8dfc-7c8f68d2bc5a',
    },
    {
      id: 'd2efb27c-98e7-4afe-99f5-b248cf7aa512',
      createdAt: '2025-07-12',
      updatedAt: '2025-07-12',
      deletedAt: null,
      userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
      text: 'bal-bla4',
      likes: 0,
      parentId: 'bb20fa4a-b9de-4f45-8dfc-7c8f68d2bc5a',
    },
    {
      id: '58f4f262-89e9-4044-9967-d22ccaeae272',
      createdAt: '2025-07-13',
      updatedAt: '2025-07-13',
      deletedAt: null,
      userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
      text: 'bal-bla4',
      likes: 0,
      parentId: 'bb20fa4a-b9de-4f45-8dfc-7c8f68d2bc5a',
    },
    {
      id: '554787ae-9ed6-4824-b28f-78689a57d314',
      createdAt: '2025-07-13',
      updatedAt: '2025-07-13',
      deletedAt: null,
      userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
      text: 'bal-bla4',
      likes: 0,
      parentId: 'bb20fa4a-b9de-4f45-8dfc-7c8f68d2bc5a',
    },
    {
      id: '824fd35e-5005-4e04-aafa-2258bc3984b4',
      createdAt: '2025-07-13',
      updatedAt: '2025-07-13',
      deletedAt: null,
      userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
      text: 'bal-bla4',
      likes: 0,
      parentId: 'bb20fa4a-b9de-4f45-8dfc-7c8f68d2bc5a',
    },
    {
      id: 'ab71190b-73ec-4ee1-8abd-e97a3a3c67b0',
      createdAt: '2025-07-13',
      updatedAt: '2025-07-13',
      deletedAt: null,
      userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
      text: 'bal-bla4',
      likes: 0,
      parentId: 'bb20fa4a-b9de-4f45-8dfc-7c8f68d2bc5a',
    },
    {
      id: 'cc6c436e-2f5b-4edf-8a25-9a46cd3245a6',
      createdAt: '2025-07-13',
      updatedAt: '2025-07-13',
      deletedAt: null,
      userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
      text: 'bal-bla4',
      likes: 0,
      parentId: 'bb20fa4a-b9de-4f45-8dfc-7c8f68d2bc5a',
    },
    {
      id: '3123f1a1-2a20-4337-9335-3cade5b9c62d',
      createdAt: '2025-07-13',
      updatedAt: '2025-07-13',
      deletedAt: null,
      userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
      text: 'bal-bla4',
      likes: 0,
      parentId: 'bb20fa4a-b9de-4f45-8dfc-7c8f68d2bc5a',
    },
    {
      id: '77361c75-92f5-4f87-876e-bbd309a8f9f6',
      createdAt: '2025-07-13',
      updatedAt: '2025-07-13',
      deletedAt: null,
      userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
      text: 'bal-bla4',
      likes: 0,
      parentId: 'bb20fa4a-b9de-4f45-8dfc-7c8f68d2bc5a',
    },
    {
      id: '39bc59e2-d764-45fe-aaed-9919abe0681d',
      createdAt: '2025-07-13',
      updatedAt: '2025-07-13',
      deletedAt: null,
      userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
      text: 'bal-bla4',
      likes: 0,
      parentId: 'bb20fa4a-b9de-4f45-8dfc-7c8f68d2bc5a',
    },
    {
      id: 'b2025c02-11fb-4779-b0c0-a7ba116aff19',
      createdAt: '2025-07-13',
      updatedAt: '2025-07-13',
      deletedAt: null,
      userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
      text: 'bal-bla4',
      likes: 0,
      parentId: 'bb20fa4a-b9de-4f45-8dfc-7c8f68d2bc5a',
    },
    {
      id: 'a8aef704-f909-4217-8336-d9cbe93b809f',
      createdAt: '2025-07-13',
      updatedAt: '2025-07-13',
      deletedAt: null,
      userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
      text: 'bal-bla4',
      likes: 0,
      parentId: 'bb20fa4a-b9de-4f45-8dfc-7c8f68d2bc5a',
    },
    {
      id: '83d665b4-0e53-4c27-9569-2f3be5cefb8b',
      createdAt: '2025-07-13',
      updatedAt: '2025-07-13',
      deletedAt: null,
      userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
      text: 'bal-bla4',
      likes: 0,
      parentId: 'bb20fa4a-b9de-4f45-8dfc-7c8f68d2bc5a',
    },
  ],
};

describe('CommentCommandService', () => {
  let service: CommentCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentCommandService,
        {
          provide: ICommentCommandRepository,
          useValue: {
            create: jest
              .fn()
              .mockImplementationOnce((create: CreateCommentDto) => {
                return {
                  userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
                  text: 'bal-bla4',
                  parentId: 'bb20fa4a-b9de-4f45-8dfc-7c8f68d2bc5a',
                  likes: 0,
                };
              }),
          },
        },
        {
          provide: ICommentQueryRepository,
          useValue: {
            findCommentbyId: jest.fn().mockResolvedValueOnce({
              userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
              text: 'bal-bla4',
              parentId: 'bb20fa4a-b9de-4f45-8dfc-7c8f68d2bc5a',
              likes: 0,
            }),
          },
        },
        {
          provide: PostsQueryRepository,
          useValue: {
            findPostbyId: jest.fn().mockResolvedValueOnce(post),
          },
        },
      ],
    }).compile();
    service = module.get(CommentCommandService);
  });
  describe.skip('create', () => {
    it('defined', async () => {
      expect(service).toBeDefined();
    });
    it('should add comment', async () => {
      createCommentDto.post = post;
      const res = await service.create(createCommentDto);
      expect(res).toEqual({
        userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
        text: 'bal-bla4',
        parentId: 'bb20fa4a-b9de-4f45-8dfc-7c8f68d2bc5a',
        likes: 0,
      });
    });
  });
});
