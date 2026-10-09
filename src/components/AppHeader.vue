<script setup lang="ts">
</script>

<template>
  <header class="bg-slate-900 text-white shadow">
    <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <router-link to="/" class="text-xl font-bold">Mini Bug-Tracker</router-link>
      <nav class="space-x-4">
        <router-link to="/" class="hover:text-indigo-400">Tableau de bord</router-link>
        <router-link to="/tickets/new" class="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-500">Nouveau Ticket</router-link>
      </nav>
    </div>
  </header>
</template>