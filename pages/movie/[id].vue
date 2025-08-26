<template>
  <div class="details">
    <Loading v-if="store.loading" />
    <p v-else-if="store.error" class="error">{{ store.error }}</p>

    <section v-else-if="store.movieDetails" class="wrap">
      <img
        class="poster"
        :src="posterUrl"
        :alt="store.movieDetails.title"
      />

      <div class="content">
        <h1>{{ store.movieDetails.title }}</h1>
        <p class="meta">
          {{ year }} •
          <span v-for="g in store.movieDetails.genres" :key="g.id">
            {{ g.name }}<span v-if="!isLastGenre(g)">, </span>
          </span>
        </p>
        <p class="rating">⭐ {{ store.movieDetails.vote_average?.toFixed?.(1) ?? '—' }}</p>

        <p class="overview">{{ store.movieDetails.overview || 'No overview.' }}</p>

        <button class="button" @click="store.toggleFavorite(store.movieDetails.id)">
          {{ store.isFavorite(store.movieDetails.id) ? 'Remove from Favorites' : 'Add to Favorites' }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMoviesStore } from '~/stores/movies'
import Loading from '~/components/Loading.vue'

const route = useRoute()
const store = useMoviesStore()

const posterUrl = computed(() => {
  const p = store.movieDetails?.poster_path
  return p ? `https://image.tmdb.org/t/p/w500/${p}` : '/placeholder-poster.png'
})
const year = computed(() => (store.movieDetails?.release_date ? new Date(store.movieDetails.release_date).getFullYear() : '—'))
const isLastGenre = (g) => store.movieDetails?.genres?.slice(-1)?.[0]?.id === g.id

onMounted(async () => {
  await store.fetchMovieDetails(route.params.id, { language: 'en-US' })
})
</script>

<style scoped lang="scss">
.details { padding: 24px 16px; }
.wrap {
  display: grid; gap: 24px; grid-template-columns: 160px 1fr;
  @media (min-width: 900px) { grid-template-columns: 240px 1fr; }
}
.poster { width: 100%; border-radius: 12px; object-fit: cover; }
.content {
  h1 { color: #fff; margin: 0 0 8px; }
  .meta { color: #aaa; margin: 0 0 6px; }
  .rating { color: #ffd166; margin: 0 0 14px; font-weight: 700; }
  .overview { color: #eaeaea; margin-bottom: 16px; }
}
.error { color: #ff6b6b; padding: 12px 16px; }
</style>
