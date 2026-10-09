<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { apiService } from '../services/api';
import { Ticket } from '../models/Ticket.ts';
import TicketCard from '../components/TicketCard.vue';
import AppHeader from '../components/AppHeader.vue';

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

    // Gère le format JSON-LD (Hydra) courant avec l'API Platform ou un tableau simple
    const rawList = data['hydra:member'] || data.member || data;
    tickets.value = rawList.map((t: any) => new Ticket(t));
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Impossible de charger les tickets depuis l’API.';
  } finally {
    loading.value = false;
  }
};

// Charger les tickets au montage
onMounted(loadTickets);

// Recharger automatiquement dès qu'un filtre ou la page change
watch([statusFilter, priorityFilter, searchTitle, page], () => {
  loadTickets();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <main class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 class="text-2xl font-bold text-slate-800">Tableau de Bord - Anomalies</h1>
      </div>

      <!-- Barre de Filtres -->
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Recherche par titre</label>
          <input
              v-model="searchTitle"
              type="text"
              placeholder="Ex: Bug de connexion..."
              class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Filtrer par statut</label>
          <select v-model="statusFilter" class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
            <option value="">Tous les statuts</option>
            <option value="open">Ouvert</option>
            <option value="in_progress">En cours</option>
            <option value="resolved">Résolu</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Filtrer par priorité</label>
          <select v-model="priorityFilter" class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
            <option value="">Toutes les priorités</option>
            <option value="low">Faible</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <!-- Message d'erreur -->
      <div v-if="errorMessage" class="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
        {{ errorMessage }}
      </div>

      <!-- Chargement -->
      <div v-if="loading" class="text-center py-16 text-gray-500">
        Chargement des tickets en cours...
      </div>

      <!-- Aucun résultat -->
      <div v-else-if="tickets.length === 0" class="text-center py-16 bg-white rounded-xl border border-gray-200">
        <p class="text-gray-500 text-base">Aucun ticket ne correspond à vos critères.</p>
      </div>

      <!-- Liste des cartes -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TicketCard v-for="ticket in tickets" :key="ticket.id" :ticket="ticket" />
      </div>

      <!-- Pagination -->
      <div class="flex justify-between items-center mt-8 bg-white p-4 rounded-xl border border-gray-200">
        <button
            @click="page > 1 && page--"
            :disabled="page === 1"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-gray-200 transition"
        >
          Précédent
        </button>
        <span class="text-sm font-medium text-gray-600">Page {{ page }}</span>
        <button
            @click="page++"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
        >
          Suivant
        </button>
      </div>
    </main>
  </div>
</template>