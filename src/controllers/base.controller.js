function BaseController() {
  this.pagination = async (model, query, eloquent, page, limit) => {
    try {
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      const startIndex = (page - 1) * limit;

      const totalCount = await model.countDocuments(query);

      let queryBuilder = model.find(query);

      if (eloquent) {
        queryBuilder = eloquent(queryBuilder);
      }

      const results = await queryBuilder.skip(startIndex).limit(limit).exec();

      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        results: results,
        pagination: {
          total: totalCount,
          totalPages: totalPages,
          currentPage: page,
          hasNextPage: hasNextPage,
          hasPreviousPage: hasPreviousPage,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  this.appendFilters = (query, filters) => {
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== null && filters[key] !== undefined) {
        if (key === "role") {
          query[key] = filters[key];
        } else {
          query[key] = { $regex: filters[key], $options: "i" };
        }
      }
    });
    return query;
  };

  return this;
}

module.exports = new BaseController();
