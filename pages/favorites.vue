<template>
  <div class="favorites">
    <div class="header-row">
      <button class="back-btn" @click="router.back()" aria-label="Go back">← Back</button>
      <h1>Your Favorites <span v-if="favMovies.length">({{ favMovies.length }})</span></h1>
    </div>

    <p v-if="!favMovies.length">No favorites yet.</p>

    <div v-else class="movies-grid compact">
      <div
        v-for="m in favMovies"
        :key="m.id"
        class="fav-item"
      >
        <MovieCard
          :movie="m"
          :is-favorite="store.isFavorite(m.id)"
          @toggle-fav="store.toggleFavorite(m.id)"
        />
        <button class="remove-btn" @click="store.toggleFavorite(m.id)">
          Remove from Favorites
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMoviesStore } from '~/stores/movies'
import MovieCard from '~/components/MovieCard.vue'

const router = useRouter()
const store = useMoviesStore()

// Show favorites drawn from what you've loaded so far (now playing + searched)
// You can enhance later to fetch details for IDs if needed.
const favMovies = computed(() =>
  store.movies.concat(store.searchedMovies).filter(m => store.isFavorite(m.id))
)

onMounted(() => store._loadFavorites())
</script>

<style scoped lang="scss">
.favorites { padding: 24px 16px; }

.header-row {
  display: flex; align-items: center; gap: 12px; margin-bottom: 12px;
  h1 { margin: 0; color: #fff; font-size: 22px; }
}

.back-btn:hover { background: #2b2b2b; }

.movies-grid {
  display: grid; gap: 24px;
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
@media (min-width: 900px) {
  .movies-grid { grid-template-columns: repeat(3, 1fr); }
}

/* Make items look a bit smaller without touching MovieCard.vue */
.movies-grid.compact .fav-item {
  transform: scale(.95);
  transform-origin: top left;
}

/* Remove button under each card */
.remove-btn {
  margin-top: 8px;
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #444;
  background: #2d2d2d;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: background .2s;
}
.remove-btn:hover { background: #3a3a3a; }
</style>
