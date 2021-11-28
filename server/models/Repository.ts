import {
  CaptureFeatureRepository,
  RawCaptureFeatureRepository,
} from 'infra/database/pg-repositories'
import { Knex } from 'knex'

import { Message } from './capture-feature'
import { RawCapture } from './raw-capture-feature'

export default class Repository {
  repoImpl: RawCaptureFeatureRepository | CaptureFeatureRepository

  constructor(
    repoImpl: RawCaptureFeatureRepository | CaptureFeatureRepository,
  ) {
    this.repoImpl = repoImpl
  }

  async add(data: Message) {
    return this.repoImpl.add(data)
  }

  async update<T>(data: T & { id: string }) {
    return this.repoImpl.update(data)
  }

  async getByFilter<T2>(
    filterCriteria: Knex<RawCapture, unknown[]>,
    options: T2,
  ) {
    return this.repoImpl.getByFilter(filterCriteria, options)
  }
}
