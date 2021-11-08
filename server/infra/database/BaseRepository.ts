const expect = require('expect-runtime')
import Session from 'infra/database/session'
import { Knex } from 'knex'
import HttpError from 'utils/HttpError'

export default class BaseRepository {
  tableName: string
  session: Session

  constructor(tableName: string, session: Session) {
    expect(tableName).defined()
    this.tableName = tableName
    this.session = session
  }

  async getById(id: string | number) {
    const object = await this.session
      .getDB()
      .select()
      .table(this.tableName)
      .where('id', id)
      .first()
    if (!object) {
      throw new HttpError(404, `Can not found ${this.tableName} by id:${id}`)
    }
    return object
  }

  /*
   * select by filter
   * support: and / or
   * options:
   *  limit: number
   */
  async getByFilter<T>(
    filter: T,
    options: { limit?: number } | undefined = undefined,
  ) {
    const whereBuilder = function (object: any, builder: Knex.QueryBuilder) {
      let result = builder
      if (object.and) {
        expect(Object.keys(object)).lengthOf(1)
        expect(object.and).a(expect.any(Array))
        for (const one of object.and) {
          if (one.or) {
            result = result.andWhere((subBuilder) =>
              whereBuilder(one, subBuilder),
            )
          } else {
            expect(Object.keys(one)).lengthOf(1)
            result = result.andWhere(
              Object.keys(one)[0],
              Object.values(one)[0] as any,
            )
          }
        }
      } else if (object.or) {
        expect(Object.keys(object)).lengthOf(1)
        expect(object.or).a(expect.any(Array))
        for (const one of object.or) {
          if (one.and) {
            result = result.orWhere((subBuilder) =>
              whereBuilder(one, subBuilder),
            )
          } else {
            expect(Object.keys(one)).lengthOf(1)
            result = result.orWhere(
              Object.keys(one)[0],
              Object.values(one)[0] as any,
            )
          }
        }
      } else {
        result.where(object)
      }
      return result
    }

    let promise = this.session
      .getDB()
      .select()
      .table(this.tableName)
      .where((builder) => whereBuilder(filter, builder))
    if (options && options.limit) {
      promise = promise.limit(options && options.limit)
    }
    const result = await promise
    expect(result).a(expect.any(Array))
    return result
  }

  async countByFilter<T>(filter: T) {
    const result = await this.session
      .getDB()
      .count()
      .table(this.tableName)
      .where(filter)
    expect(result).match([
      {
        count: expect.any(String),
      },
    ])
    return parseInt(result[0].count.toString())
  }

  async update<T>(object: T & { id: string | number }) {
    const result = await this.session
      .getDB()(this.tableName)
      .update(object)
      .where('id', object.id)
      .returning('*')
    expect(result).match([
      {
        id: expect.any(Number),
      },
    ])
    return result[0]
  }

  async create<T>(object: T) {
    const result = await this.session
      .getDB()(this.tableName)
      .insert(object)
      .returning('*')
    expect(result).match([
      {
        id: expect.anything(),
      },
    ])
    return result[0]
  }
}
