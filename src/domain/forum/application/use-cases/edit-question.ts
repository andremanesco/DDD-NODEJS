import { Either, left, right } from "src/core/either"
import { Question } from "../../enterprise/entities/question"
import { QuestionsRepository } from "../repositories/question-repository"
import { NotAllowedError } from "./errors/not-allowed-error"
import { ResourceNotFoundError } from "./errors/resource-nort-found-error"
import { QuestionAttachmentsRepository } from "../repositories/question-attachments-repository"
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list"
import { QuestionAttachment } from "../../enterprise/entities/question-attachment"
import { UniqueEntityId } from "src/core/entities/unique-entity-id"

interface EditQuestionUseCaseRequest {
  authorId: string
  questionId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAtachmentsRepository: QuestionAttachmentsRepository
  ) { }
  

  async execute({
    authorId,
    questionId,
    content,
    title,
    attachmentsIds
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    // Get current question attachments
    const currentQuestionAttachments = await this.questionAtachmentsRepository.findManyByQuestionId(questionId)
    
    // Create a new QuestionAttachmentList instance based on the current question attachments
    const questionAttachmentList = new QuestionAttachmentList(currentQuestionAttachments)

    // Create a new list of QuestionAttachment instances based on the attachments
    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id
      })
    })

    questionAttachmentList.update(questionAttachments)

    question.title = title
    question.content = content
    question.attachments = questionAttachmentList

    await this.questionsRepository.save(question)

    return right({
      question 
    })
  }
}