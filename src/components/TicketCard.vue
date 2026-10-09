<script setup lang="ts">
import { Ticket } from '../models/Ticket.ts';

// On définit la prop 'ticket' en utilisant notre DTO
defineProps<{
  ticket: Ticket;
}>();
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-5 border border-gray-100 flex flex-col justify-between hover:shadow-lg transition">
    <div>
      <!-- En-tête de la carte avec la priorité et le statut -->
      <div class="flex justify-between items-center mb-3">
        <span :class="['px-2.5 py-1 rounded-full text-xs font-semibold border', ticket.priorityBadgeClass]">
          {{ ticket.priority.toUpperCase() }}
        </span>
        <span class="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600 font-medium">
          {{ ticket.statusLabel }}
        </span>
      </div>

      <!-- Titre et Description -->
      <h3 class="text-lg font-bold text-slate-800 mb-2 line-clamp-1">{{ ticket.title }}</h3>
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ ticket.description }}</p>
    </div>

    <!-- Bouton d'action pour voir les détails -->
    <div class="pt-4 border-t border-gray-100 flex justify-end">
      <router-link
          :to="{ name: 'TicketDetail', params: { id: ticket.id } }"
          class="text-sm bg-indigo-50 text-indigo-600 font-medium px-4 py-2 rounded-lg hover:bg-indigo-100 transition"
      >
        Voir les détails →
      </router-link>
    </div>
  </div>
</template>