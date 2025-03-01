import { beforeEach, expect, it, describe } from 'vitest'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from 'tests/repositories/in-memory-question-comments-repository'
import { makeQuestionComment } from 'tests/factories/make-question-comment'
import { FetchQuestionCommentUseCase } from './fetch-question-comments'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    await inMemoryQuestionCommentsRepository.create(makeQuestionComment({
        questionId: new UniqueEntityId('question-1')
    }))
    await inMemoryQuestionCommentsRepository.create(makeQuestionComment({
        questionId: new UniqueEntityId('question-1')
    }))
    await inMemoryQuestionCommentsRepository.create(makeQuestionComment({
        questionId: new UniqueEntityId('question-1')
    }))

    const result = await sut.execute({
        questionId: 'question-1',
        page: 1
    })

    expect(result.value?.questionComments).toHaveLength(3)

    })

    it.skip('should be able to fetch paginated question comments', async () => {
        for (let i =1; i <= 22; i++) {
            await inMemoryQuestionCommentsRepository.create(makeQuestionComment({
                questionId: new UniqueEntityId('question-1')
            }))
        }

        const result = await sut.execute({
            questionId: 'question-1',
            page: 2
        })

        expect(result.value?.questionComments).toHaveLength(2)
    })
})
