<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { apiService } from '../services/api';
import { Ticket } from '../models/Ticket';
import TicketCard from '../components/TicketCard.vue';
import AppSidebar from '../components/AppSidebar.vue';

const tickets = ref<Ticket[]>([]);
const page = ref<number>(1);
const statusFilter = ref<string>('');
const priorityFilter = ref<string>('');
const searchTitle = ref<string>('');
const loading = ref<boolean>(false);
const errorMessage = ref<string>('');

const loadTickets = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const params: Record<string, any> = { page: page.value };
    if (statusFilter.value) params.status = statusFilter.value;
    if (priorityFilter.value) params.priority = priorityFilter.value;
    if (searchTitle.value) params.title = searchTitle.value;

    const data = await apiService.getTickets(params);
    const rawList = data['hydra:member'] || data.member || data;
    tickets.value = rawList.map((t: any) => new Ticket(t));
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Impossible de charger les tickets depuis l’API.';
  } finally {
    loading.value = false;
  }
};

onMounted(loadTickets);
watch([statusFilter, priorityFilter, searchTitle, page], loadTickets);
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex">

    <AppSidebar />

    <main class="flex-1 ml-64 p-8 md:p-12">

      <div class="mb-10 border-b border-slate-200 pb-6 flex items-center justify-between">
        <h1 class="text-4xl font-extrabold text-slate-950 tracking-tighter">Tableau de Bord</h1>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <!-- Titre -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-slate-500">Recherche</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input v-model="searchTitle" type="text" placeholder="Titre du ticket..." class="w-full pl-10 pr-4 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition" />
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-sm font-medium text-slate-500">Statut</label>
          <select v-model="statusFilter" class="w-full border border-slate-200 rounded-xl p-3 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition">
            <option value="">Tous les statuts</option>
            <option value="open">Ouvert</option>
            <option value="in_progress">En cours</option>
            <option value="resolved">Résolu</option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="text-sm font-medium text-slate-500">Priorité</label>
          <select v-model="priorityFilter" class="w-full border border-slate-200 rounded-xl p-3 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition">
            <option value="">Toutes les priorités</option>
            <option value="low">Faible</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-xl mb-8 shadow-sm font-medium">
        {{ errorMessage }}
      </div>

      <div v-if="loading" class="text-center py-24 text-slate-500 flex flex-col items-center gap-4">
        <svg class="animate-spin w-10 h-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        Chargement des tickets en cours...
      </div>

      <div v-else-if="tickets.length > 0" class="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <TicketCard v-for="ticket in tickets" :key="ticket.id" :ticket="ticket" class="card-hover" />
      </div>

      <div v-else class="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200">
        <p class="text-slate-500 text-lg font-medium">Aucun ticket ne correspond à vos critères.</p>
      </div>

      <div class="flex justify-between items-center mt-12 border-t border-slate-200 pt-8">
        <button @click="page > 1 && page--" :disabled="page === 1" class="px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl font-semibold text-sm disabled:opacity-40 hover:bg-slate-50 transition shadow-sm">Précédent</button>
        <span class="text-sm font-bold text-indigo-700 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">Page {{ page }}</span>
        <button @click="page++" class="px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl font-semibold text-sm hover:bg-slate-50 transition shadow-sm">Suivant</button>
      </div>
    </main>
  </div>
</template>