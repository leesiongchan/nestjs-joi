import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';

import { PersonResolver } from './person/person.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
  ],
  providers: [PersonResolver],
})
export class AppModule {}
