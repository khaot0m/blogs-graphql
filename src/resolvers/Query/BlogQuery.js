const Blog = require('../../database/models/Blog')

const feed = async (parent, args, context, info) => {
  const skip = args.skip || 0
  const limit = args.limit || 5
  const where = args.searchTerm
    ? {
        $or: [
          { title: { $regex: args.searchTerm } },
          { content: { $regex: args.searchTerm } }
        ]
      }
    : {}

  const blogs = await Blog.find()
    .sort('-createdAt')
    .where(where)
    .skip(skip)
    .limit(limit)
    .lean()

  const count = await Blog.find()
    .count()
    .lean()

  return { blogs, count }
}

const oneBlog = async (parent, args, context, info) => {
  const blog = await Blog.findOne({ id: args.id }).lean()

  return blog
}

module.exports = {
  feed,
  oneBlog
}
