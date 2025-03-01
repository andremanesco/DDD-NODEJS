import { PaginationParams } from 'src/core/repositories/pagination-params'
import { AnswerComment } from '../../../forum/enterprise/entities/answer-comment'

export interface AnswerCommentsRepository {
  create(answerComment: AnswerComment): Promise<void>
  delete(answerComment: AnswerComment): Promise<void>
  findById(id: string): Promise<AnswerComment | null>
  findManyByAnswerId(qanswerId: string, params: PaginationParams): Promise<AnswerComment[]>

}