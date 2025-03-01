import { UniqueEntityId } from "src/core/entities/unique-entity-id"
import { Question } from "../../enterprise/entities/question"
import { QuestionsRepository } from "../repositories/question-repository"
import { Either, right } from "src/core/either"

interface CreateQuestionUseCaseRequest {
  authorId: string,
  title: string,
  content: string
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
  question: Question
  }
>

export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) { }

  async execute({
    authorId,
    title,
    content
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      title,
      content
    })

    await this.questionsRepository.create(question)

    return right({
      question 
    })
  }
}