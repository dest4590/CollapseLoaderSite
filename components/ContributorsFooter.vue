<template>
  <div class="flex flex-col items-center py-4 bg-base-200">
    <p class="text-sm text-base-content/70 mb-2">{{ $t('footer.thank') }}</p>
    <div class="flex space-x-2 overflow-x-auto">
      <template v-if="contributors.length">
        <a
          v-for="contributor in contributors"
          :key="contributor.id"
          :href="contributor.html_url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block"
        >
          <img
            :src="contributor.avatar_url"
            :alt="contributor.login"
            class="w-8 h-8 rounded-full hover:opacity-80"
          />
        </a>
      </template>
      <template v-else>
                <span class="text-sm text-base-content/50">Loading…</span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from '#i18n';
const { t } = useI18n();
interface Contributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}
const contributors = ref<Contributor[]>([]);
const repoOwner = 'dest4590';
const repoName = 'collapseloader';
const fetchContributors = async () => {
  try {
    const resp = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contributors?per_page=20`);
    if (resp.ok) {
      const data = (await resp.json()) as Contributor[];
      contributors.value = data;
    } else {
      console.error('Failed to fetch contributors', resp.status);
    }
  } catch (e) {
    console.error('Error fetching contributors', e);
  }
};
onMounted(fetchContributors);
</script>

<style scoped>
/* Ensure the footer does not overlap content */
</style>
