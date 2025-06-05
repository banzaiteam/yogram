// import { Resolver, Query, ResolveReference, Args } from '@nestjs/graphql';
// import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
// @ObjectType()
// @Directive('@key(fields: "id")')
// export class User {
//   @Field(() => ID)
//   id: string;

//   @Field()
//   name: string;
// }

// const users = [
//   { id: '1', name: 'Alice' },
//   { id: '2', name: 'Bob' },
// ];

// @Resolver(() => User)
// export class UsersResolver {
//   @Query(() => [User])
//   users() {
//     return users;
//   }

//   @Query(() => User)
//   user(@Args('id') id: string) {
//     return users.find((user) => user.id === id);
//   }

//   @ResolveReference()
//   resolveReference(reference: {
//     __typename?: string;
//     id: string;
//   }): User | undefined {
//     return users.find((user) => user.id === reference.id);
//   }
// }
