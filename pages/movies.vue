<template>
  <div class="home">
    <section class="hero">
      <h1>Find your next movie</h1>
      <p>Search by title, year, or genre.</p>
    </section>

    <!-- Search Form -->
    <form class="search-form" @submit.prevent="onSubmit">
      <input
        v-model.trim="title"
        type="text"
        placeholder="Title (e.g., Inception)"
        aria-label="Title"
      />
      <input
        v-model.trim="year"
        type="number"
        placeholder="Year (e.g., 2024)"
        aria-label="Year"
        min="1878"
        max="2100"
      />
      <select v-model="genreId" aria-label="Genre">
        <option value="">All Genres</option>
        <option
          v-for="g in store.genres"
          :key="g.id"
          :value="g.id"
        >
          {{ g.name }}
        </option>
      </select>

      <button class="button" type="submit">Search</button>
      <button class="button button-light" type="button" @click="clear">Clear</button>
    </form>

    <!-- Feedback -->
     <div v-if="store.loading" class="loading-wrap">
  <Loading
    :fullscreen="submitting"
    :message="loadingMessage"
    :size="48"
    :thickness="5"
  />
</div>
    <p v-else-if="store.error" class="error">{{ store.error }}</p>

    <!-- Results grid -->
    <section v-else class="container movies">
      <h2 v-if="hasFilters">Search Results</h2>
      <h2 v-else>Now Playing</h2>

      <div class="movies-grid">
        <MovieCard
          v-for="m in cards"
          :key="m.id"
          :movie="m"
          :is-favorite="store.isFavorite(m.id)"
          @toggle-fav="store.toggleFavorite(m.id)"
        />
      </div>

      <!-- Pagination -->
      <Pagination
        :page="store.page"
        :total-pages="store.totalPages"
        :loading="store.loading"
        @prev="goPrev"
        @next="goNext"
        @go="goPage"
      />
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMoviesStore } from '~/stores/movies'
import MovieCard from '~/components/MovieCard.vue'
import Pagination from '~/components/Pagination.vue'
import Loading from '~/components/Loading.vue'

const store = useMoviesStore()

const title = ref('')
const year = ref('')
const genreId = ref('')
const submitting = ref(false)

const hasFilters = computed(() => title.value || year.value || genreId.value)
const cards = computed(() => (hasFilters.value ? store.searchedMovies : store.movies))
const loadingMessage = computed(() =>
  hasFilters.value ? 'Searching movies…' : 'Loading now playing…'
)
const onSubmit = async () => {
  submitting.value = true
  try {
    if (!hasFilters.value) {
      await store.fetchNowPlaying({ page: 1, language: 'en-US' })
    } else {
      await store.searchMovies({
        title: title.value,
        year: year.value,
        genreId: genreId.value,
        page: 1,
        language: 'en-US',
      })
    }
  } finally {
    submitting.value = false
  }
}

const clear = async () => {
  submitting.value = true
  try {
    title.value = ''
    year.value = ''
    genreId.value = ''
    store.clearSearch()
    await store.fetchNowPlaying({ page: 1, language: 'en-US' })
  } finally {
    submitting.value = false
  }
}

const goPrev = () => store.prevPage()
const goNext = () => store.nextPage()
const goPage = (p) => store.goToPage(p)

onMounted(async () => {
    await Promise.all([
      store.fetchGenres(),
      store.fetchNowPlaying({ page: 1, language: 'en-US' }),
    ])
})
</script>

<style scoped lang="scss">
.hero {
  padding: 32px 16px 8px;
  h1 { color: #fff; font-size: 28px; margin: 0 0 6px; }
  p { color: #ccc; margin: 0; }
}
.search-form {
  display: grid;
  grid-template-columns: 1fr 140px 180px auto auto;
  gap: 12px;
  padding: 16px;
  align-items: center;

  input, select {
    width: 100%;
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid #444;
    background: #222;
    color: #fff;
  }
  .button {
    padding: 10px 14px;
  }

  @media (max-width: 840px) {
    grid-template-columns: 1fr 1fr;
    .button { width: 100%; }
  }
}
.loading-wrap { padding: 48px 16px; }
.error { color: #ff6b6b; padding: 12px 16px; }
.container.movies { padding: 24px 16px; }

.movies-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  @media (min-width: 600px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 900px) { grid-template-columns: repeat(3, 1fr); }
  @media (min-width: 1200px){ grid-template-columns: repeat(4, 1fr); }
}
</style>
