import { UniqueEntityId } from "src/core/entities/unique-entity-id";
import { Question, QuestionProps } from "src/domain/forum/enterprise/entities/question";
import { Slug } from "src/domain/forum/enterprise/entities/value-objects/slug";
import { faker } from '@faker-js/faker'

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityId,
) {
  const question = Question.create({
    title: faker.lorem.sentences(),
    slug: Slug.create('example-question'),
    authorId: new UniqueEntityId('1'),
    content: faker.lorem.text(),
    ...override,
  }, id)

  return question
}