<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { apiService } from '../services/api';
import AppSidebar from '../components/AppSidebar.vue';

const router = useRouter();

const title = ref('');
const description = ref('');
const priority = ref('low');
const loading = ref(false);
const errorMessage = ref('');

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
  <div class="min-h-screen bg-slate-50 flex">

    <!-- Sidebar -->
    <AppSidebar />

    <main class="flex-1 ml-64 p-8 md:p-12">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-3xl font-extrabold text-slate-950 tracking-tight mb-8">Créer une nouvelle anomalie</h1>

        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <form @submit.prevent="handleSubmit" class="space-y-6">

            <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl text-sm font-medium">
              {{ errorMessage }}
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-semibold text-slate-700">Titre du ticket *</label>
              <input
                  v-model="title"
                  type="text"
                  placeholder="Ex: Erreur 500 sur la page de paiement"
                  class="w-full border border-slate-200 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition"
              />
              <p class="text-xs text-slate-400">Entre 3 et 255 caractères (Actuellement : {{ title.length }})</p>
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-semibold text-slate-700">Description détaillée *</label>
              <textarea
                  v-model="description"
                  rows="5"
                  placeholder="Décrivez les étapes pour reproduire le bug..."
                  class="w-full border border-slate-200 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition"
              ></textarea>
              <p class="text-xs text-slate-400">Minimum 15 caractères (Actuellement : {{ description.length }})</p>
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-semibold text-slate-700">Priorité</label>
              <select
                  v-model="priority"
                  class="w-full border border-slate-200 rounded-xl p-3.5 text-sm bg-white focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition"
              >
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div class="flex justify-end space-x-4 pt-6 border-t border-slate-100">
              <router-link
                  to="/"
                  class="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition shadow-sm"
              >
                Annuler
              </router-link>
              <button
                  type="submit"
                  :disabled="!isFormValid || loading"
                  class="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 transition disabled:opacity-50 shadow-sm"
              >
                {{ loading ? 'Enregistrement...' : 'Créer le ticket' }}
              </button>
            </div>

          </form>
        </div>
      </div>
    </main>
  </div>
</template>