import { InMemoryAnswersRepository } from '../../../../../tests/repositories/in-memory-answers-repository'
import { makeAnswer } from '../../../../../tests/factories/make-answer'
import { InMemoryAnswerCommentsRepository } from '../../../../../tests/repositories/in-memory-answer-comments-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { beforeEach, describe, expect, it } from 'vitest'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment on Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()

    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()

    await inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'Comentário teste',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
      'Comentário teste',
    )
  })
})