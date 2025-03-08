import { UniqueEntityId } from "src/core/entities/unique-entity-id"
import { Question } from "../../enterprise/entities/question"
import { QuestionsRepository } from "../repositories/question-repository"
import { Either, right } from "src/core/either"
import { QuestionAttachment } from "../../enterprise/entities/question-attachment"
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list"

interface CreateQuestionUseCaseRequest {
  authorId: string,
  title: string,
  content: string,
  attachmentsIds: string[]
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
    content,
    attachmentsIds
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      title,
      content
    })

    const questionAttachment = attachmentsIds.map(attachmentId =>{
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id
      })
    })

    question.attachments = new QuestionAttachmentList(questionAttachment)

    await this.questionsRepository.create(question)

    return right({
      question 
    })
  }
}