import { beforeEach, expect, it, describe } from 'vitest'
import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository'
import { makeQuestion } from 'tests/factories/make-question'
import { DeleteQuestionUseCase } from './delete-question'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'
import { Q } from 'node_modules/@faker-js/faker/dist/airline-BcEu2nRk.cjs'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe('Delete question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to delete a question', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId('author-1'),
    }, new UniqueEntityId('question-1'))
    
    await inMemoryQuestionsRepository.create(newQuestion)

    await sut.execute({
      authorId: newQuestion.authorId.toString(),
      questionId: 'question-1'
    })

    expect(inMemoryQuestionsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question from another user', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId('author-1'),
    }, new UniqueEntityId('question-1'))

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      authorId: 'author-2',
      questionId: 'question-1'
    })
    
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})

