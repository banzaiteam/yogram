import { IQueueBindings } from 'apps/libs/common/message-brokers/interfaces/queue-bindings.interface';

export enum UsersBindingKeysEnum {
  Users_Verify_One = 'users.verify.*',
  Users_Verify_Many = 'users.verify.#',
}

export const usersQueuesBindings: IQueueBindings[] = [
  {
    users: [UsersBindingKeysEnum.Users_Verify_One],
    users2: [UsersBindingKeysEnum.Users_Verify_Many],
  },
];
