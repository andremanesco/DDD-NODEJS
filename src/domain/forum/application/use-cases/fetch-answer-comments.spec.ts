import { beforeEach, expect, it, describe } from 'vitest'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from 'tests/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from 'tests/factories/make-answer-comment'
import { FetchAnswerCommentUseCase } from './fetch-answer-comments'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    await inMemoryAnswerCommentsRepository.create(makeAnswerComment({
        answerId: new UniqueEntityId('answer-1')
    }))
    await inMemoryAnswerCommentsRepository.create(makeAnswerComment({
        answerId: new UniqueEntityId('answer-1')
    }))
    await inMemoryAnswerCommentsRepository.create(makeAnswerComment({
        answerId: new UniqueEntityId('answer-1')
    }))

    const result = await sut.execute({
        answerId: 'answer-1',
        page: 1
    })

    expect(result.value?.answerComments).toHaveLength(3)

    })

    it.skip('should be able to fetch paginated answer comments', async () => {
        for (let i =1; i <= 22; i++) {
            await inMemoryAnswerCommentsRepository.create(makeAnswerComment({
                answerId: new UniqueEntityId('answer-1')
            }))
        }

        const result = await sut.execute({
            answerId: 'answer-1',
            page: 2
        })

        expect(result.value?.answerComments).toHaveLength(2)
    })
})
