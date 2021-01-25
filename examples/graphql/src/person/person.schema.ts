import * as Joi from 'joi';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { JoiSchema } from 'nestjs-joi';

@ObjectType()
export class Person {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  birthDate?: Date;

  @JoiSchema(Joi.string().valid('MALE', 'FEMALE'))
  @Field({ nullable: true })
  gender?: string;
}
