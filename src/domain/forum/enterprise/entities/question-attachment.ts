import { Entity } from "src/core/entities/entity";
import { UniqueEntityId } from "src/core/entities/unique-entity-id";

export interface QuestionAttachmentProps {
    questionId: UniqueEntityId
    attachmentId: UniqueEntityId
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
    get questionId() {
        return this.props.questionId
    }

    get attachmentId() {
        return this.props.attachmentId
    }

    static create(props: QuestionAttachmentProps, id?: UniqueEntityId) {
        const questionAttachment = new QuestionAttachment(props)

        return questionAttachment
    }
}