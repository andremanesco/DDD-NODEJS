import { Either, right } from "src/core/either"
import { QuestionComment } from "../../enterprise/entities/question-comment"
import { QuestionCommentsRepository } from "../repositories/question-comments-repository"

interface FetchQuestionCommentUseCaseRequest {
  page: number
  questionId: string
}

type FetchQuestionCommentsUseCaseResponse = Either<
  null,
  {
    questionComments: QuestionComment[]
  }
>

export class FetchQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) { }

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const questionComments = await this.questionCommentsRepository.findManyByQuestionId(questionId, {page})

    return right({
      questionComments
    })
  }
}