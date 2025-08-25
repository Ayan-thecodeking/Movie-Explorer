import axios from 'axios'

export default defineEventHandler(async (event) => {
  const { tmdbApiKey } = useRuntimeConfig()
  const queryIn = getQuery(event)
  const page = queryIn.page || 1
  const language = queryIn.language || 'en-US'

  const res = await axios.get('https://api.themoviedb.org/3/movie/popular', {
    params: {
      api_key: tmdbApiKey,
      language,
      page
    }
  })
  return res.data
})
