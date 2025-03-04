import { Post } from '../models/Post'
import { H3Event } from 'h3'

interface IPost {
  _id: string
  title: string
  content: string
  authorId: string
  createdAt: string
  updatedAt: string
}

function toIPost(doc: any): IPost {
  return {
    _id: doc._id.toString(),
    title: doc.title,
    content: doc.content,
    authorId: doc.authorId.toString(),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  }
}

// GET /api/posts
export const GET = defineEventHandler(async (event: H3Event) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('authorId', 'name avatar')
      .lean()
    return posts.map(toIPost)
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des posts',
      cause: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// GET /api/posts/:id
export const getById = defineEventHandler(async (event: H3Event) => {
  try {
    const id = getRouterParam(event, 'id')
    const post = await Post.findById(id)
      .populate('authorId', 'name avatar')
      .lean()
    
    if (!post) {
      throw createError({
        statusCode: 404,
        message: 'Post non trouvé'
      })
    }
    
    return toIPost(post)
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération du post',
      cause: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// POST /api/posts
export const POST = defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event)
    const newPost = new Post(body)
    const savedPost = await newPost.save()
    const populatedPost = await Post.findById(savedPost._id)
      .populate('authorId', 'name avatar')
      .lean()
    
    setResponseStatus(event, 201)
    return toIPost(populatedPost)
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: 'Erreur lors de la création du post',
      cause: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// PUT /api/posts/:id
export const PUT = defineEventHandler(async (event: H3Event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    )
      .populate('authorId', 'name avatar')
      .lean()
    
    if (!updatedPost) {
      throw createError({
        statusCode: 404,
        message: 'Post non trouvé'
      })
    }
    
    return toIPost(updatedPost)
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: 'Erreur lors de la mise à jour du post',
      cause: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// DELETE /api/posts/:id
export const DELETE = defineEventHandler(async (event: H3Event) => {
  try {
    const id = getRouterParam(event, 'id')
    const deletedPost = await Post.findByIdAndDelete(id)
    
    if (!deletedPost) {
      throw createError({
        statusCode: 404,
        message: 'Post non trouvé'
      })
    }
    
    setResponseStatus(event, 204)
    return null
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la suppression du post',
      cause: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}) 