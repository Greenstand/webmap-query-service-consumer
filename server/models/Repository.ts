import CaptureFeatureRepository from 'infra/database/CaptureFeatureRepository'
import RawCaptureFeatureRepository from 'infra/database/RawCaptureFeatureRepository'
import { Knex } from 'knex'

import { CaptureFeature } from './capture-feature'
import { RawCaptureFeature } from './raw-capture-feature'

export default class Repository {
  repoImpl: RawCaptureFeatureRepository | CaptureFeatureRepository

  constructor(
    repoImpl: RawCaptureFeatureRepository | CaptureFeatureRepository,
  ) {
    this.repoImpl = repoImpl
  }

  async add(data: CaptureFeature | RawCaptureFeature) {
    return this.repoImpl.add(data as CaptureFeature)
  }

  async update<T>(data: T & { id: string }) {
    return this.repoImpl.update(data)
  }

  async getByFilter<T2>(
    filterCriteria: Knex<RawCaptureFeature, unknown[]>,
    options: T2,
  ) {
    return this.repoImpl.getByFilter(filterCriteria, options)
  }
}
