<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { apiService } from '../services/api';
import { Ticket } from '../models/Ticket.ts';
import AppHeader from '../components/AppHeader.vue';

const route = useRoute();
const router = useRouter();

const ticketId = route.params.id as string;
const ticket = ref<Ticket | null>(null);
const loading = ref<boolean>(true);
const errorMessage = ref<string>('');
const successMessage = ref<string>('');

// Champs éditables pour le formulaire de mise à jour (PATCH)
const selectedStatus = ref<string>('');
const selectedPriority = ref<string>('');

const loadTicket = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const data = await apiService.getTicket(ticketId);
    ticket.value = new Ticket(data);
    selectedStatus.value = ticket.value.status;
    selectedPriority.value = ticket.value.priority;
  } catch (error) {
    console.error(error);
    errorMessage.value = "Impossible de charger les détails du ticket.";
  } finally {
    loading.value = false;
  }
};

const handleUpdate = async () => {
  try {
    errorMessage.value = '';
    successMessage.value = '';

    // Envoi de la requête PATCH avec l'en-tête spécifique géré dans le service api.ts
    await apiService.updateTicket(ticketId, {
      status: selectedStatus.value,
      priority: selectedPriority.value
    });

    successMessage.value = "Ticket mis à jour avec succès !";
    if (ticket.value) {
      ticket.value.status = selectedStatus.value as any;
      ticket.value.priority = selectedPriority.value as any;
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = "Erreur lors de la mise à jour du ticket.";
  }
};

const handleDelete = async () => {
  if (!confirm("Voulez-vous vraiment supprimer ce ticket ?")) return;

  try {
    await apiService.deleteTicket(ticketId);
    router.push({ name: 'Dashboard' });
  } catch (error) {
    console.error(error);
    errorMessage.value = "Erreur lors de la suppression du ticket.";
  }
};

onMounted(loadTicket);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <main class="max-w-3xl mx-auto px-4 py-8">
      <!-- Navigation retour et suppression -->
      <div class="mb-6 flex justify-between items-center">
        <router-link to="/" class="text-indigo-600 hover:underline text-sm font-medium">
          ← Retour au tableau de bord
        </router-link>
        <button
            @click="handleDelete"
            class="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition"
        >
          Supprimer le ticket
        </button>
      </div>

      <!-- Chargement -->
      <div v-if="loading" class="text-center py-16 text-gray-500">
        Chargement des détails...
      </div>

      <!-- Erreur -->
      <div v-else-if="errorMessage && !ticket" class="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
        {{ errorMessage }}
      </div>

      <!-- Contenu du ticket -->
      <div v-else-if="ticket" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">

        <!-- Messages de retour -->
        <div v-if="successMessage" class="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-sm">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {{ errorMessage }}
        </div>

        <div>
          <div class="flex items-center space-x-3 mb-3">
            <span :class="['px-2.5 py-1 rounded-full text-xs font-semibold border', ticket.priorityBadgeClass]">
              {{ ticket.priority.toUpperCase() }}
            </span>
            <span class="text-xs px-2.5 py-1 bg-gray-100 rounded text-gray-600 font-medium">
              Statut : {{ ticket.statusLabel }}
            </span>
          </div>
          <h1 class="text-2xl font-bold text-slate-800">{{ ticket.title }}</h1>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
          <p class="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-line border border-gray-100 text-sm leading-relaxed">
            {{ ticket.description }}
          </p>
        </div>

        <!-- Section de modification (PATCH) -->
        <div class="border-t border-gray-100 pt-6">
          <h3 class="text-md font-bold text-slate-800 mb-4">Modifier le statut ou la priorité</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Statut</label>
              <select v-model="selectedStatus" class="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="open">Ouvert</option>
                <option value="in_progress">En cours</option>
                <option value="resolved">Résolu</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Priorité</label>
              <select v-model="selectedPriority" class="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end">
            <button
                @click="handleUpdate"
                class="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 transition"
            >
              Enregistrer les modifications
            </button>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>