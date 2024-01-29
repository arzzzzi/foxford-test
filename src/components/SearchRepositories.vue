<template>
  <div :class="{ dark: darkMode }" class="min-h-[94vh]">
    <img
      v-if="darkMode"
      src="https://sjinnovation.com/sites/default/files/inline-images/Let%20There%20Be%20Light%20Mode.png"
      alt="Темная тема"
      class="rounded cursor-pointer p-[10px]"
      @click="toggleDarkMode"
      height="55px"
      width="55px"
    />
    <img
      v-else
      src="https://sjinnovation.com/sites/default/files/inline-images/What%27s%20Dark%20Mode%2C%20Anyway.png"
      alt="Светлая тема"
      class="rounded cursor-pointer p-[10px]"
      @click="toggleDarkMode"
      height="55px"
      width="55px"
    />
    <div class="flex justify-around">
      <input
        class="lg:min-w-72 rounded-xl lg:text-[18px] pl-2 md:min-w-60 md:text-[14px] sm:min-w-52 sm:text-[10px] transition-all"
        :class="{ 'bg-gray-800': darkMode, 'bg-gray-200': !darkMode }"
        v-model="searchQuery"
        @input="searchRepositories"
        placeholder="Введите название репозитория"
      />
      <div>
        <label
          class="lg:text-[18px] md:text-[14px] sm:text-[10px] transition-all"
          :class="{ 'text-white': darkMode, 'text-black': !darkMode }"
          for="perPage"
        >
          Результатов на странице:
        </label>
        <select
          id="perPage"
          class="rounded-xl lg:text-[18px] md:text-[14px] sm:text-[10px] transition-all"
          :class="{ 'bg-gray-800': darkMode, 'bg-gray-200': !darkMode }"
          v-model="perPage"
          @change="changePerPage"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
      </div>
      <div>
        <select
          id="sortSelect"
          class="rounded-xl lg:text-[16px] md:text-[12px] sm:text-[10px] transition-all"
          :class="{ 'bg-gray-800': darkMode, 'bg-gray-200': !darkMode }"
          v-model="sortType"
          @change="changeSortType"
        >
          <option value="stars.desc">По звездам ↓</option>
          <option value="stars.asc">По звездам ↑</option>
          <option value="updated.desc">По дате обновления ↓</option>
          <option value="updated.asc">По дате обновления ↑</option>
        </select>
      </div>
    </div>
    <div v-if="repositories.length" class="mt-6 mb-6 md:mt-5 md:mb-5 sm:mt-4 sm:mb-4">
      <div v-for="repo in repositories" class="border-2 border-[#163836] p-6 text-left md:border-1 md:p-5 sm:border-1 sm:p-4" :key="repo.id">
        <h1 class="text-2xl font-bold text-[#163836] md:text-xl sm:text-sm"
        :class="{ 'text-[#163836]': !darkMode, 'text-[#59f0e7]': darkMode }">
          <a :href="`https://github.com/${repo.owner.login}/`" class="">{{ repo.owner.login }}</a>
          /
          <a :href="`https://github.com/${repo.owner.login}/${repo.name}`">{{ repo.name }}</a>
        </h1>
        <p class="text-sm md:text-xs sm:text-[10px]"><span class="underline decoration-1 font-bold">Описание:</span> {{ repo.description }}</p>
        <p class="text-sm md:text-xs sm:text-[10px]"><span class="underline decoration-1 font-bold">Язык:</span> {{ repo.language }}</p>
        <p class="text-sm md:text-xs sm:text-[10px]"><span class="underline decoration-1 font-bold">Количество звезд:</span> {{ repo.stargazers_count }}</p>
        <p class="text-sm md:text-xs sm:text-[10px]"><span class="underline decoration-1 font-bold">Дата обновления:</span> {{ formatApiDate(repo.updated_at) }}</p>
      </div>
    </div>
  </div>
  <paginationComponent :page="currentPage" :totalPages="totalPages" :perPage="perPage" @page-change="changePage" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import PaginationComponent from './PaginationComponent.vue';

interface Repository {
  id: number;
  name: string;
  owner: {
    login: string;
  };
  description: string;
  language: string;
  stargazers_count: number;
  updated_at: string; 
}

export default defineComponent({
  components: {
    PaginationComponent,
  },
  setup() {
    const searchQuery = ref('');
    const repositories = ref([] as Repository[]);
    const currentPage = ref(1);
    const perPage = ref(10);
    const totalPages = ref(0);
    const sortType = ref<string>('stars.desc'); 
    const darkMode = ref(false); 

    const searchRepositories = async () => {
      try {
        const [sort, order] = sortType.value.split('.');
        const response = await axios.get(`https://api.github.com/search/repositories`, {
          params: {
            q: searchQuery.value,
            sort,
            order,
            per_page: perPage.value,
            page: currentPage.value,
          },
        });
        repositories.value = response.data.items;
        totalPages.value = Math.ceil(response.data.total_count / perPage.value);
      } catch (error) {
        console.error('Error fetching repositories', error);
      }
    };

    const changeSortType = () => {
      searchRepositories();
    };

    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value;
    };

    const changePage = (newPage: number) => {
      currentPage.value = newPage;
      searchRepositories();
    };

    const changePerPage = () => {
      currentPage.value = 1;
      searchRepositories();
    };

    const formatApiDate = (apiDate: string) => {
      const date = new Date(apiDate);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      };
      const locales = 'ru-RU';
      return date.toLocaleDateString(locales, options);
    };

    return {
      searchQuery,
      repositories,
      currentPage,
      totalPages,
      perPage,
      searchRepositories,
      changePage,
      changePerPage,
      formatApiDate,
      sortType,
      changeSortType,
      darkMode, 
      toggleDarkMode
    };
  },
});
</script>

<style scoped>

.dark {
  background-color: #1a202c;
  color: #d8dee9;
}

.dark .border-2 {
  border-color: #4a5568;
}

.dark .bg-orange-100 {
  background-color: #ffedcc;
}

.dark .bg-gray-800 {
  background-color: #2d3748;
}

.dark .bg-gray-200 {
  background-color: #edf2f7;
}

.dark .text-white {
  color: #ffffff;
}

.dark .text-black {
  color: #000000;
}

</style>