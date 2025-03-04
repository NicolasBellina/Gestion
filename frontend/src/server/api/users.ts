import { User } from '../models/User'
import { connectToDb } from '../utils/db'
import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  try {
    await connectToDb()
    const users = await User.find().sort({ createdAt: -1 })
    return users
  } catch (error) {
    console.error('Error fetching users:', error)
    throw createError({
      statusCode: 500,
      message: 'Error fetching users'
    })
  }
}) 