import { UniqueEntityId } from "src/core/entities/unique-entity-id";
import { Answer, AnswerProps } from "src/domain/forum/enterprise/entities/answer";
import { Slug } from "src/domain/forum/enterprise/entities/value-objects/slug";
import { faker } from '@faker-js/faker'

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityId,
) {
  const answer = Answer.create({
    questionId: new UniqueEntityId(),
    authorId: new UniqueEntityId(),
    content: faker.lorem.text(),
    ...override,
  }, id)

  return answer
}