<template>
  <div class="home">
    <section class="hero">
      <h1>Find your next movie</h1>
      <p>Search by title, year, or genre.</p>
    </section>

    <!-- Search Form -->
    <form class="search-form" @submit.prevent="onSubmit">
      <input v-model.trim="title" type="text" placeholder="Title (e.g., Inception)" />
       <div>
    <input
      v-model.trim="year"
      type="number"
      placeholder="Year (e.g., 2024)"
      min="1978"
      :max="currentYear"
      :class="{ 'invalid': isYearInvalid }"
    />
  </div>
       <select v-model="genreId">
        <option value="">All Genres</option>
        <option v-for="g in store.genres" :key="g.id" :value="g.id">
          {{ g.name }}
        </option>
      </select>

      <button :disabled="!hasFilters || isYearInvalid" class="button" type="submit">Search</button>
      <button class="button button-light" type="button" @click="clear">Clear</button>
    </form>

    <!-- Feedback -->
    <div v-if="store.loading" class="loading-wrap">
      <Loading :message="loadingMessage" />
    </div>
    <p v-else-if="store.error" class="error">{{ store.error }}</p>

    <!-- Results grid -->
    <section v-else class="container movies">
      <h2 v-if="store.lastMode === 'search'">Search Results</h2>
      <h2 v-else>Now Playing</h2>

      <div class="movies-grid">
        <MovieCard v-for="m in cards" :key="m.id" :movie="m" :is-favorite="store.isFavorite(m.id)"
          @toggle-fav="store.toggleFavorite(m.id)" />
      </div>

      <!-- Pagination -->
      <Pagination :page="store.page" :total-pages="store.totalPages" :loading="store.loading" @prev="goPrev"
        @next="goNext" @go="goPage" />
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
const hasFilters = computed(() => title.value || year.value || genreId.value)
const cards = computed(() =>
  store.lastMode === 'search' ? store.searchedMovies : store.movies
)

const loadingMessage = computed(() =>
  store.lastMode === 'search' ? 'Searching movies…' : 'Loading now playing…'
)
const currentYear = new Date().getFullYear()

const isYearInvalid = computed(() => {
  if (!year.value) return false   // empty allowed
  const num = Number(year.value)
  return isNaN(num) || num < 1978 || num > currentYear
})

// Called only when Search is clicked
const onSubmit = async () => {
  if (!title.value && !year.value && !genreId.value) {
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
}

// Reset back to "Now Playing"
const clear = async () => {
  store.lastMode = 'now_playing'
  title.value = ''
  year.value = ''
  genreId.value = ''
  await store.fetchNowPlaying({ page: 1, language: 'en-US' })
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
  padding: 16px 16px 8px 16px;

  h1 {
    color: #fff;
    font-size: 28px;
    margin: 0 0 6px;
  }

  p {
    color: #ccc;
    margin: 0;
  }
}

.search-form {
  display: grid;
  grid-template-columns: 1fr 140px 180px auto auto;
  gap: 12px;
  padding: 16px;
  align-items: center;

  input,
  select {
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

    .button {
      width: 100%;
    }
  }
}

.loading-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px; // ensures vertical space
  padding: 16px;
}

.container.movies {
  padding: 20px 16px;
}
input.invalid {
  border: 1px solid #ff4d4f;   /* red border */
  background-color: #2a1e1e;   /* subtle red tint (optional) */
}
.movies-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(1, minmax(0, 1fr));

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
