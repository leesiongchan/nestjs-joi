import * as Joi from 'joi';
import { Field, InputType, OmitType } from '@nestjs/graphql';
import { JoiSchema } from 'nestjs-joi';

import { Person } from '../person.schema';

@InputType()
export class CreatePersonInput extends OmitType(Person, ['id'], InputType) {
  @JoiSchema(Joi.string().min(10))
  @Field()
  extraA?: string;
}
