import { Either, left, right } from "src/core/either"
import { Answer } from "../../enterprise/entities/answer"
import { AnswersRepository } from "../repositories/answers-repository"
import { NotAllowedError } from "./errors/not-allowed-error"
import { ResourceNotFoundError } from "./errors/resource-nort-found-error"
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list"
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment"
import { UniqueEntityId } from "src/core/entities/unique-entity-id"
import { AnswerAttachmentsRepository } from "../repositories/answer-attachments-repository"

interface EditAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
  attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAtachmentsRepository: AnswerAttachmentsRepository
  ) { }

  async execute({
    authorId,
    answerId,
    content,
    attachmentsIds
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    // Get current answer attachments
    const currentAnswerAttachments = await this.answerAtachmentsRepository.findManyByAnswerId(answerId)
    
    // Create a new AnswerAttachmentList instance based on the current answer attachments
    const answerAttachmentList = new AnswerAttachmentList(currentAnswerAttachments)

    // Create a new list of AnswerAttachment instances based on the attachments
    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id
      })
    })

    answerAttachmentList.update(answerAttachments)

    answer.content = content
    answer.attachments = answerAttachmentList

    await this.answersRepository.save(answer)

    return right({
      answer
    })
  }
}