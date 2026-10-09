<script setup lang="ts">
</script>

<template>
  <aside class="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-50">

    <div class="p-6 h-20 flex items-center border-b border-slate-700/50">
      <router-link to="/" class="text-2xl font-bold text-indigo-400 tracking-tight">
        BugTracker
      </router-link>
    </div>

    <!-- Navigation principale -->
    <nav class="flex-grow p-6 space-y-3 overflow-y-auto">
      <router-link
          to="/"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-indigo-600 hover:text-white transition duration-150 group"
          active-class="bg-indigo-700 text-white shadow-inner"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
        Tableau de bord
      </router-link>

      <router-link
          to="/tickets/new"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-indigo-600 hover:text-white transition duration-150 group"
          active-class="bg-indigo-700 text-white shadow-inner"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        Nouveau Ticket
      </router-link>
    </nav>

    <div class="p-6 border-t border-slate-700/50 text-sm text-slate-500">
      v1.0.0
    </div>
  </aside>
</template>