<template>
  <div class="details">
    <!-- Back button -->
    <button class="back-btn" @click="router.back()" aria-label="Go back">
      ← Back
    </button>

    <Loading v-if="store.loading" />
    <p v-else-if="store.error" class="error">{{ store.error }}</p>

    <section v-else-if="store.movieDetails" class="wrap">
      <img class="poster" :src="posterUrl" :alt="store.movieDetails.title" />

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

        <button class="fav-btn" @click="onToggleFavorite">
          {{ store.isFavorite(store.movieDetails.id) ? 'Remove from Favorites' : 'Add to Favorites' }}
        </button>
      </div>
    </section>

    <!-- Snackbar -->
    <transition name="snack">
      <div v-if="snack.open" class="snackbar" role="status" aria-live="polite">
        {{ snack.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMoviesStore } from '~/stores/movies'
import Loading from '~/components/Loading.vue'

const route = useRoute()
const router = useRouter()
const store = useMoviesStore()

const posterUrl = computed(() => {
  const p = store.movieDetails?.poster_path
  return p ? `https://image.tmdb.org/t/p/w500/${p}` : '/placeholder-poster.png'
})
const year = computed(() =>
  store.movieDetails?.release_date
    ? new Date(store.movieDetails.release_date).getFullYear()
    : '—'
)
const isLastGenre = (g) => store.movieDetails?.genres?.slice(-1)?.[0]?.id === g.id

// Snackbar state
const snack = ref({ open: false, message: '' })
let snackTimer

function showSnack(message, ms = 1800) {
  clearTimeout(snackTimer)
  snack.value = { open: true, message }
  snackTimer = setTimeout(() => {
    snack.value.open = false
  }, ms)
}

function onToggleFavorite() {
  const id = store.movieDetails?.id
  if (!id) return
  const wasFavorite = store.isFavorite(id)
  store.toggleFavorite(id)
  showSnack(wasFavorite ? 'Removed from favorites' : 'Added to favorites')
}

onMounted(async () => {
  await store.fetchMovieDetails(route.params.id, { language: 'en-US' })
})
</script>

<style scoped lang="scss">
.details {
  padding: 24px 16px;
  position: relative;
}

.back-btn:hover {
  background: #2b2b2b;
}

.wrap {
  display: grid;
  gap: 24px;
  grid-template-columns: 160px 1fr;
  margin-top: 12px;
  @media (min-width: 900px) {
    grid-template-columns: 240px 1fr;
  }
}

.poster {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
}

.content {
  h1 {
    color: #fff;
    margin: 0 0 8px;
  }

  .meta {
    color: #aaa;
    margin: 0 0 6px;
  }

  .rating {
    color: #ffd166;
    margin: 0 0 14px;
    font-weight: 700;
  }

  .overview {
    color: #eaeaea;
    margin-bottom: 16px;
  }
}

.error {
  color: #ff6b6b;
  padding: 12px 16px;
}

/* Snackbar */
.snackbar {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  background: #1f2937;
  /* dark slate */
  color: #fff;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #374151;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
  z-index: 2000;
  max-width: 80%;
  text-align: center;
}

/* Simple fade/slide anim */
.snack-enter-from,
.snack-leave-to {
  opacity: 0;
  transform: translate(-50%, 12px);
}

.snack-enter-active,
.snack-leave-active {
  transition: all .22s ease;
}

.fav-btn {
  appearance: none;
  background: #2d2d2d;
  color: #fff;
  border: 1px solid #444;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;

  &:hover {
    background: #3a3a3a;
  }
}
</style>
