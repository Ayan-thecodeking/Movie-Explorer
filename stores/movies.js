import { defineStore } from 'pinia'

const FAVORITES_KEY = 'cn_tmdb_favorites_v1'

export const useMoviesStore = defineStore('movies', {
  state: () => ({
    movies: [],
    searchedMovies: [],
    loading: false,
    error: null,
    page: 1,
    totalPages: 0,
    totalResults: 0,
    language: 'en-US',
    lastQuery: '',
    genres: [],                 // <— for dropdown
    movieDetails: null,         // <— details page
    favorites: [],              // <— persisted ids
  }),

  getters: {
    isFavorite: (state) => (id) => state.favorites.includes(id),
    genreNameById: (state) => (id) => state.genres.find(g => g.id === id)?.name || '',
  },

  actions: {
    _loadFavorites() {
      try {
        const raw = localStorage.getItem(FAVORITES_KEY)
        this.favorites = raw ? JSON.parse(raw) : []
      } catch { this.favorites = [] }
    },
    _saveFavorites() {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(this.favorites))
    },
    toggleFavorite(id) {
      const idx = this.favorites.indexOf(id)
      if (idx === -1) this.favorites.push(id)
      else this.favorites.splice(idx, 1)
      this._saveFavorites()
    },

    async fetchGenres() {
      try {
        const { public: { tmdbApiKey } } = useRuntimeConfig()
        const { $request, $Keys } = useNuxtApp()
        const res = await $request($Keys.GET, 'https://api.themoviedb.org/3/genre/movie/list', {
          params: { api_key: tmdbApiKey, language: this.language },
          isTokenRequired: false,
        })
        this.genres = res?.data?.genres || []
      } catch (e) {
        // don’t hard-fail UI if genres fail
        console.warn('Failed to load genres', e?.message)
      }
    },

    async fetchNowPlaying({ page = 1, language = 'en-US' } = {}) {
      this.loading = true
      this.error = null
      try {
        const { public: { tmdbApiKey } } = useRuntimeConfig()
        const { $request, $Keys } = useNuxtApp()

        const res = await $request(
          $Keys.GET,
          'https://api.themoviedb.org/3/movie/now_playing',
          {
            params: { api_key: tmdbApiKey, language, page },
            isTokenRequired: false,
          }
        )

        const data = res?.data
        this.movies = Array.isArray(data?.results) ? data.results : []
        this.page = Number(data?.page ?? page)
        this.totalPages = Number(data?.total_pages ?? 0)
        this.totalResults = Number(data?.total_results ?? 0)
        this.language = language
      } catch (e) {
        this.error = e?.message || 'Failed to load movies'
        this.movies = []
      } finally {
        this.loading = false
      }
    },

    // Multi-field search:
    // - If genre/year provided => use /discover/movie (supports with_genres + year)
    // - Else if title only => use /search/movie (better matching)
    async searchMovies({ title = '', year = '', genreId = '', page = 1, language = 'en-US' }) {
      // no inputs? behave like "clear"
      if (!title && !year && !genreId) {
        this.searchedMovies = []
        this.lastQuery = ''
        return
      }

      this.loading = true
      this.error = null
      try {
        const { public: { tmdbApiKey } } = useRuntimeConfig()
        const { $request, $Keys } = useNuxtApp()

        const useDiscover = !!(genreId || year) // discover supports filters
        const url = useDiscover
          ? 'https://api.themoviedb.org/3/discover/movie'
          : 'https://api.themoviedb.org/3/search/movie'

        const params = {
          api_key: tmdbApiKey,
          language,
          page,
        }

        if (useDiscover) {
          if (genreId) params.with_genres = genreId
          if (year) params.year = year
          if (title) params.with_keywords = title // optional: discover is weaker for title
        } else {
          params.query = title
          if (year) params.year = year // search supports year too
        }

        const res = await $request($Keys.GET, url, {
          params,
          isTokenRequired: false,
        })

        const data = res?.data
        this.searchedMovies = Array.isArray(data?.results) ? data.results : []
        this.page = Number(data?.page ?? page)
        this.totalPages = Number(data?.total_pages ?? 0)
        this.totalResults = Number(data?.total_results ?? 0)
        this.language = language
        this.lastQuery = JSON.stringify({ title, year, genreId })
      } catch (e) {
        this.error = e?.message || 'Failed to search movies'
        this.searchedMovies = []
      } finally {
        this.loading = false
      }
    },

    async fetchMovieDetails(id, { language = 'en-US' } = {}) {
      this.loading = true
      this.error = null
      this.movieDetails = null
      try {
        const { public: { tmdbApiKey } } = useRuntimeConfig()
        const { $request, $Keys } = useNuxtApp()

        const res = await $request($Keys.GET, `https://api.themoviedb.org/3/movie/${id}`, {
          params: {
            api_key: tmdbApiKey,
            language,
            append_to_response: 'videos,images,credits', // richer details
            include_image_language: 'en,null',
          },
          isTokenRequired: false,
        })

        this.movieDetails = res?.data || null
      } catch (e) {
        this.error = e?.message || 'Failed to load movie details'
        this.movieDetails = null
      } finally {
        this.loading = false
      }
    },
  },
})
