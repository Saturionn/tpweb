<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { apiService } from '../services/api';
import AppHeader from '../components/AppHeader.vue';

const router = useRouter();

const title = ref('');
const description = ref('');
const priority = ref('low');
const loading = ref(false);
const errorMessage = ref('');

// Validation front-end basée sur les contraintes de l'énoncé
const isTitleValid = computed(() => title.value.length >= 3 && title.value.length <= 255);
const isDescriptionValid = computed(() => description.value.length >= 15);
const isFormValid = computed(() => isTitleValid.value && isDescriptionValid.value);

const handleSubmit = async () => {
  if (!isFormValid.value) return;

  loading.value = true;
  errorMessage.value = '';

  try {
    await apiService.createTicket({
      title: title.value,
      description: description.value,
      priority: priority.value
    });

    // Redirection vers le tableau de bord après succès
    router.push({ name: 'Dashboard' });
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Erreur lors de la création du ticket. Vérifiez les données saisies.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <main class="max-w-3xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold text-slate-800 mb-6">Créer une nouvelle anomalie</h1>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">

          <!-- Message d'erreur -->
          <div v-if="errorMessage" class="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
            {{ errorMessage }}
          </div>

          <!-- Titre -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Titre du ticket *</label>
            <input
                v-model="title"
                type="text"
                placeholder="Ex: Erreur 500 sur la page de paiement"
                class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <p class="text-xs text-gray-500 mt-1">Entre 3 et 255 caractères (Actuellement : {{ title.length }})</p>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Description détaillée *</label>
            <textarea
                v-model="description"
                rows="5"
                placeholder="Décrivez les étapes pour reproduire le bug..."
                class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">Minimum 15 caractères (Actuellement : {{ description.length }})</p>
          </div>

          <!-- Priorité -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Priorité</label>
            <select
                v-model="priority"
                class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-end space-x-4 pt-4 border-t border-gray-100">
            <router-link
                to="/"
                class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
            >
              Annuler
            </router-link>
            <button
                type="submit"
                :disabled="!isFormValid || loading"
                class="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 transition disabled:opacity-50"
            >
              {{ loading ? 'Enregistrement...' : 'Créer le ticket' }}
            </button>
          </div>

        </form>
      </div>
    </main>
  </div>
</template>