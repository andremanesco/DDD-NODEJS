import { AnswersRepository } from "../repositories/answers-repository"
import { Question } from "../../enterprise/entities/question"
import { QuestionsRepository } from "../repositories/question-repository"
import { Either, left, right } from "src/core/either"
import { ResourceNotFoundError } from "./errors/resource-nort-found-error"
import { NotAllowedError } from "./errors/not-allowed-error"

interface ChooseQuestionBestAnswerUseCaseRequest {
  answerId: string
  authorId: string
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository
  ) { }

  async execute({
    answerId,
    authorId
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const question = await this.questionsRepository.findById(answer.questionId.toString())

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    question.bestAnswerId = answer.id

    await this.answersRepository.save(answer)

    return right({
      question 
    })
  }
}