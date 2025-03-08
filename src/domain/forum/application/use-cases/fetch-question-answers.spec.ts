import { beforeEach, expect, it, describe } from 'vitest'
import { InMemoryAnswersRepository } from 'tests/repositories/in-memory-answers-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { makeAnswer } from 'tests/factories/make-answer'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { skip } from 'node:test'
import { InMemoryAnswerAttachmentsRepository } from 'tests/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch question answers', async () => {
    await inMemoryAnswersRepository.create(makeAnswer({
        questionId: new UniqueEntityId('question-1')
    }))
    await inMemoryAnswersRepository.create(makeAnswer({
        questionId: new UniqueEntityId('question-1')
    }))
    await inMemoryAnswersRepository.create(makeAnswer({
        questionId: new UniqueEntityId('question-1')
    }))

    const result = await sut.execute({
        questionId: 'question-1',
        page: 1
    })

    expect(result.value?.answers).toHaveLength(3)

    })

    skip('should be able to fetch paginated question answers', async () => {
        for (let i =1; i <= 22; i++) {
            await inMemoryAnswersRepository.create(makeAnswer({
                questionId: new UniqueEntityId('question-1')
            }))
        }

        const result = await sut.execute({
            questionId: 'question-1',
            page: 2
        })

        expect(result.value?.answers).toHaveLength(2)
    })
})
