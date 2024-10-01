import { FilterQuery, Query } from 'mongoose'

class QueryApi<T> {
  public query: Query<T[], T>
  public queryParams: Record<string, unknown>

  constructor(query: Query<T[], T>, queryParams: Record<string, unknown>) {
    this.query = query
    this.queryParams = queryParams
  }

  search(searchableFields: string[]) {
    const searchTerm = this.queryParams?.searchTerm
    if (searchTerm) {
      this.query = this.query.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' }
            }) as FilterQuery<T>
        )
      })
    }

    return this
  }

  filter() {
    const filterParams = { ...this.queryParams }

    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields']
    excludeFields.forEach((field) => delete filterParams[field])

    let queryString = JSON.stringify(filterParams)

    queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`)
    this.query = this.query.find(JSON.parse(queryString))

    return this
  }

  sort() {
    const sortBy = (this.queryParams?.sort as string)?.split(',')?.join(' ') || '-createdAt'
    this.query = this.query.sort(sortBy)

    return this
  }

  paginate() {
    const page = Number(this.queryParams?.page) || 1
    const limit = Number(this.queryParams?.limit) || 6
    const skip = (page - 1) * limit

    this.query = this.query.skip(skip).limit(limit)

    return this
  }

  fields() {
    const selectFields = (this.queryParams?.fields as string)?.split(',')?.join(' ') || '-__v'

    this.query = this.query.select(selectFields)
    return this
  }

  async countTotal() {
    const priceArr = await this.query.model.find().distinct('pricePerSlot')

    const highestPrice = Math.ceil(Math.max(...priceArr))
    const lowestPrice = Math.ceil(Math.min(...priceArr))
    const highestCapacity = Math.ceil(Math.max(...(await this.query.model.find().distinct('capacity'))))
    const lowestCapacity = Math.ceil(Math.min(...(await this.query.model.find().distinct('capacity'))))
    const filterConditions = this.query.getFilter()
    const totalDocuments = await this.query.model.countDocuments(filterConditions)
    const page = Number(this.queryParams?.page) || 1
    const limit = Number(this.queryParams?.limit) || 6
    const totalPages = Math.ceil(totalDocuments / limit)

    return {
      page,
      limit,
      totalDocuments,
      totalPages,
      highestPrice,
      lowestPrice,
      highestCapacity,
      lowestCapacity
    }
  }
}

export default QueryApi
