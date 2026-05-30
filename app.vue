<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ContributorsFooter v-if="showFooter" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from '#imports';
import ContributorsFooter from '~/components/ContributorsFooter.vue';

const route = useRoute();

const showFooter = computed(() => {
  if (route.name && typeof route.name === 'string' && route.name.startsWith('clients-id')) {
    return false;
  }
  return true;
});
const i18nHead = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: 'id',
  addSeoAttributes: true
})

useHead({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs.lang
  },
  link: [...(i18nHead.value.link || [])],
  meta: [...(i18nHead.value.meta || [])]
})
</script>