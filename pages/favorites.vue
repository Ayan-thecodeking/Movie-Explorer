<template>
  <div class="favorites">
    <h1>Your Favorites</h1>
    <p v-if="!favMovies.length">No favorites yet.</p>

    <div v-else class="movies-grid">
      <MovieCard
        v-for="m in favMovies"
        :key="m.id"
        :movie="m"
        :is-favorite="store.isFavorite(m.id)"
        @toggle-fav="store.toggleFavorite(m.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useMoviesStore } from '~/stores/movies'
import MovieCard from '~/components/MovieCard.vue'

const store = useMoviesStore()
const favMovies = computed(() =>
  store.movies.concat(store.searchedMovies).filter(m => store.isFavorite(m.id))
)

onMounted(() => store._loadFavorites())
</script>

<style scoped>
.favorites { padding: 24px 16px; }
.movies-grid {
  display: grid; gap: 24px;
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
@media (min-width: 900px) {
  .movies-grid { grid-template-columns: repeat(3, 1fr); }
}
</style>
