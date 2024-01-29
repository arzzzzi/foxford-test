<template>
  <nav aria-label="Page navigation" v-if="pages.length > 0">
    <ul class="flex justify-center list-none p-0">
      <li class="my-0 mx-[5px]" :class="{ disabled: currentPage === 1 }">
        <a class="text-[#163836] lg:text-[16px] md:text-[13px] sm:text-10px] cursor-pointer	 hover:underline decoration-1" href="#" aria-label="Previous" @click="changePage(currentPage !== undefined ? currentPage - 1 : 1)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li v-for="pageItem in pages" :key="pageItem" class="my-0 mx-[5px]" :class="{ active: pageItem === currentPage }">
        <a class="text-[#163836] lg:text-[16px] md:text-[13px] sm:text-[10px] cursor-pointer	 hover:underline decoration-1" href="#" @click="changePage(pageItem)">{{ pageItem }}</a>
      </li>
      <li class="my-0 mx-[5px]" :class="{ disabled: currentPage === allPages }">
        <a class="text-[#163836] lg:text-[16px] md:text-[13px] sm:text-[10px] cursor-pointer	 hover:underline decoration-1" href="#" aria-label="Next" @click="changePage(currentPage !== undefined ? currentPage + 1 : 1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  props: {
    page: Number,
    totalPages: Number,
    perPage: Number,
  },
  setup(props, { emit }) {
    const currentPage = ref(props.page);
    const pages = ref<number[]>([]);

    const calculatePages = () => {
      const newPages: number[] = [];
      const startPage = Math.max(1, currentPage.value !== undefined ? currentPage.value - 2 : 1);
      const endPage = Math.min(props.totalPages !== undefined ? props.totalPages : 1, startPage + 4);

      for (let i = startPage; i <= endPage; i++) {
        newPages.push(i);
      }

      pages.value = newPages;
    };

    watch(() => props.page, (newPage) => {
      currentPage.value = newPage;
      calculatePages();
    });

    watch(() => props.totalPages, () => {
      calculatePages();
    });

    const changePage = (newPage: number) => {
  if (newPage >= 1 && (!props.totalPages || newPage <= props.totalPages)) {
    currentPage.value = newPage;
    emit('page-change', currentPage.value);
  }
};

    return {
      currentPage,
      allPages: props.totalPages,
      pages,
      changePage,
    };
  },
});
</script>

<style scoped>

.active {
  font-weight: bold;
}
</style>
