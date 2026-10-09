<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { apiService } from '../services/api';
import { Ticket } from '../models/Ticket';
import AppSidebar from '../components/AppSidebar.vue';

const route = useRoute();
const router = useRouter();

const ticketId = route.params.id as string;
const ticket = ref<Ticket | null>(null);
const loading = ref<boolean>(true);
const errorMessage = ref<string>('');
const successMessage = ref<string>('');

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
  <div class="min-h-screen bg-slate-50 flex">

    <!-- Sidebar -->
    <AppSidebar />

    <main class="flex-1 ml-64 p-8 md:p-12">
      <div class="max-w-3xl mx-auto">

        <div class="mb-8 flex justify-between items-center">
          <router-link to="/" class="text-indigo-600 hover:underline text-sm font-semibold flex items-center gap-2">
            ← Retour au tableau de bord
          </router-link>
          <button
              @click="handleDelete"
              class="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 transition shadow-sm"
          >
            Supprimer le ticket
          </button>
        </div>

        <div v-if="loading" class="text-center py-24 text-slate-500">
          Chargement des détails...
        </div>

        <div v-else-if="errorMessage && !ticket" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl text-sm font-medium">
          {{ errorMessage }}
        </div>

        <div v-else-if="ticket" class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-8">

          <div v-if="successMessage" class="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-4 rounded-xl text-sm font-medium">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl text-sm font-medium">
            {{ errorMessage }}
          </div>

          <div>
            <div class="flex items-center space-x-3 mb-4">
              <span :class="['px-3 py-1 rounded-full text-xs font-bold border shadow-xs', ticket.priorityBadgeClass]">
                {{ ticket.priority.toUpperCase() }}
              </span>
              <span class="text-xs px-3 py-1 bg-slate-100 rounded-full text-slate-600 font-semibold">
                Statut : {{ ticket.statusLabel }}
              </span>
            </div>
            <h1 class="text-3xl font-extrabold text-slate-950 tracking-tight">{{ ticket.title }}</h1>
          </div>

          <div>
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Description</h3>
            <p class="text-slate-700 bg-slate-50 p-5 rounded-xl border border-slate-100 text-sm leading-relaxed whitespace-pre-line">
              {{ ticket.description }}
            </p>
          </div>

          <div class="border-t border-slate-100 pt-8">
            <h3 class="text-lg font-bold text-slate-900 mb-6">Modifier le statut ou la priorité</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div class="space-y-1">
                <label class="block text-sm font-semibold text-slate-700">Statut</label>
                <select v-model="selectedStatus" class="w-full border border-slate-200 rounded-xl p-3.5 text-sm bg-white focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition">
                  <option value="open">Ouvert</option>
                  <option value="in_progress">En cours</option>
                  <option value="resolved">Résolu</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="block text-sm font-semibold text-slate-700">Priorité</label>
                <select v-model="selectedPriority" class="w-full border border-slate-200 rounded-xl p-3.5 text-sm bg-white focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition">
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
                  class="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 transition shadow-sm"
              >
                Enregistrer les modifications
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>