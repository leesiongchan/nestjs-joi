import { UsePipes } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JoiPipe, JoiValidationGroups } from 'nestjs-joi';
import { CreatePersonInput } from './dto/create-person.input';

import { Person } from './person.schema';

@Resolver()
export class PersonResolver {
  @UsePipes(new JoiPipe({ group: JoiValidationGroups.CREATE }))
  @Mutation(() => Person)
  createPerson(@Args('input') input: CreatePersonInput) {
    const person = new Person();
    person.id = '1';
    person.name = input.name;
    person.birthDate = input.birthDate;
    person.gender = input.gender;

    return person;
  }

  @Query(() => Person)
  person() {
    const person = new Person();
    person.id = '2';
    person.name = 'Brad Pitt';
    person.birthDate = new Date('1963-12-18');
    person.gender = 'MALE';

    return person;
  }
}
