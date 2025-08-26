<template>
  <article class="movie">
    <div class="movie-img">
      <NuxtLink :to="`/movie/${movie.id}`" class="img-link">
        <img :src="posterUrl" :alt="movie.title" />
        <p class="review">{{ movie.vote_average?.toFixed?.(1) ?? movie.vote_average ?? '—' }}</p>
        <p class="overview">{{ movie.overview || 'No overview available.' }}</p>
      </NuxtLink>
      <button class="fav-btn" :aria-pressed="isFavorite"
        :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'" @click.stop="$emit('toggle-fav')">
        <span v-if="isFavorite">♥</span>
        <span v-else>♡</span>
      </button>
    </div>

    <div class="info">
      <p class="title">
        {{ movie.title?.slice(0, 30) }}<span v-if="movie.title?.length > 30">…</span>
      </p>
      <p class="release">
        Released:
        {{ releaseText }}
      </p>
      <NuxtLink class="button button-light" :to="`/movie/${movie.id}`">
        Get More Info
      </NuxtLink>
    </div>
  </article>
</template>

<script setup>
import noImg from '../../assets/no_img.png'
const props = defineProps({
  movie: { type: Object, required: true },
  isFavorite: { type: Boolean, default: false },
})
const posterUrl = computed(() =>
  props.movie.poster_path
    ? `https://image.tmdb.org/t/p/w500/${props.movie.poster_path}`
    : noImg
)
const releaseText = computed(() => {
  const d = props.movie.release_date ? new Date(props.movie.release_date) : null
  return d
    ? d.toLocaleString('en-us', { month: 'long', day: 'numeric', year: 'numeric' })
    : '—'
})
</script>

<style scoped lang="scss">
.movie {
  display: flex;
  flex-direction: column;
  position: relative;
}

.movie-img {
  position: relative;
  overflow: hidden;
  border-radius: 10px;

  .img-link {
    display: block;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .review {
    position: absolute;
    top: 0;
    left: 0;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #c92502;
    color: #fff;
    border-radius: 0 0 12px 0;
    font-weight: 700;
  }

  .overview {
    line-height: 1.45;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.78);
    padding: 12px;
    color: #fff;
    transform: translateY(100%);
    transition: transform .25s ease-in-out;
    max-height: 70%;
    overflow: auto;
  }

  &:hover .overview {
    transform: translateY(0);
  }

  .fav-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    border: 1px solid #fff3;
    border-radius: 999px;
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    font-size: 16px;
    cursor: pointer;
  }
}

.info {
  margin-top: 10px;

  .title {
    color: #fff;
    font-size: 18px;
    margin: 0 0 4px;
  }

  .release {
    color: #c9c9c9;
    margin: 0 0 8px;
  }
}
</style>
