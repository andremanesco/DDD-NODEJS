import { Entity } from "src/core/entities/entity"
import { UniqueEntityId } from "src/core/entities/unique-entity-id"
import { Optional } from "src/core/types/optional"
import { AnswerAttachmentList } from "./answer-attachment-list"

export interface AnswerProps {
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  content: string
  attachments: AnswerAttachmentList
  createdAt: Date
  updatedAt?: Date
}

export class Answer extends Entity<AnswerProps> {
  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get content() {
    return this.props.content
  }

  get attachments() {
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get excerpt() {
    return this.content
      .substring(0, 120)
      .trimEnd()
      .concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set content(content: string) {
    this.props.content = content

    this.touch()
  }

  set attachments(attachments: AnswerAttachmentList) {
    this.props.attachments = attachments

    this.touch()
  }


  static create(
    props: Optional<AnswerProps, 'createdAt' | 'attachments'>,
    id?: UniqueEntityId
  ) {
    const answer = new Answer({
      ...props,
      attachments: props.attachments ?? new AnswerAttachmentList(),
      createdAt: props.createdAt ?? new Date(),
    }, id)

    return answer
  }
}