import { Query } from 'mongoose';

const defaultLimit = 10;

class QueryBuilder<T> {
  constructor(
    public modelQuery: Query<T[], T>,
    public query: Record<string, unknown>,
  ) {}
  // { $or : [ {fieldName : value}, {fieldName : value} ] }
  search(searchableFields: string[]) {
    const searchTerm = this.query?.searchTerm;
    if (searchTerm) {
      const searchCondition = searchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      }));
      this.modelQuery = this.modelQuery.find({
        $or: searchCondition,
      });
    }
    return this;
  }
  // range=pricePerSlot:gte=200,lte=200&range=capacity:gte=200,lte=200
  range() {
    let rangeArr: string | string[] = this.query?.range as string;
    if (rangeArr) {
      const query: Record<string, Record<string, number>> = {};
      if (typeof rangeArr === 'string') rangeArr = [rangeArr];
      if (rangeArr) {
        rangeArr.forEach((range) => {
          const [field, conditions] = range.split(':');
          query[field] = {};
          conditions.split(',').forEach((condition) => {
            const [operator, value] = condition.split('=');
            query[field][`$${operator}`] = Number(value);
          });
        });
      }
      this.modelQuery = this.modelQuery.find(query);
    }

    return this;
  }
  /* {
    fieldName : { $in : [value1, value2..] },
    fieldName1 : { $in : [value1, value2..] }
}*/
  filter(excludeFields: string[]) {
    const copyQuery = { ...this.query };
    excludeFields.forEach((field) => delete copyQuery[field]);
    if (copyQuery) {
      const query: Record<string, unknown> = {};
      for (const item in copyQuery) {
        const value = copyQuery[item] as string;
        query[item] = {
          $in: value.includes(',') ? value.split(',') : value,
        };
      }
      this.modelQuery = this.modelQuery.find(query);
    }
    return this;
  }
  sort() {
    if (this.query?.sort) {
      const sortMsg = this.query.sort as string;
      const sort = sortMsg.includes(',')
        ? sortMsg.split(',').join(' ')
        : sortMsg;
      this.modelQuery = this.modelQuery.sort(sort);
    }
    return this;
  }

  paginate() {
    let limit = defaultLimit;
    if (this.query?.limit || this.query?.page) {
      let page = 1,
        skip = 0;
      if (this?.query?.limit) limit = Number(this.query.limit);
      if (this?.query?.page) page = Number(this.query.page);
      skip = limit * (page - 1);
      this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    } else {
      this.modelQuery = this.modelQuery.limit(limit);
    }
    return this;
  }

  fields() {
    if (this.query?.fields) {
      const fieldStr = this.query.fields as string;
      const fields = fieldStr.includes(',')
        ? fieldStr.split(',').join(' ')
        : fieldStr;
      this.modelQuery = this.modelQuery.select(fields);
    }
    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const totalData = await this.modelQuery.model.countDocuments(totalQueries);
    let limit = this.query?.limit
      ? Number(this.query.limit)
      : Number(defaultLimit);
    limit = totalData < limit ? totalData : limit;
    const page = this.query?.page ? Number(this.query?.page) : 1;
    const skip = (page - 1) * limit;
    const totalPage = Math.ceil(totalData / limit);
    return {
      totalData,
      limit,
      page,
      skip,
      totalPage,
    };
  }
}

export default QueryBuilder;
