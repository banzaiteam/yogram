import { IQueueBindings } from 'apps/libs/common/message-brokers/interfaces/queue-bindings.interface';

export enum FilesBindingKeysEnum {
  Files_Uploaded_One = 'files.uploaded.*',
  Files_Uploaded_Many = 'files.uploaded.#',
  Files_Uploaded_Posts = 'files.uploaded.posts',
}

export const filesQueuesBindings: IQueueBindings[] = [
  {
    files_one: [FilesBindingKeysEnum.Files_Uploaded_One],
    files_many: [FilesBindingKeysEnum.Files_Uploaded_Many],
  },
];
