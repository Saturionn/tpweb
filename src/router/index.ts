import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import CreateTicketView from '../views/CreateTicketView.vue';
import TicketDetailView from '../views/TicketDetailView.vue';

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: DashboardView
    },
    {
        path: '/tickets/new',
        name: 'CreateTicket',
        component: CreateTicketView
    },
    {
        path: '/tickets/:id',
        name: 'TicketDetail',
        component: TicketDetailView,
        props: true // Permet de passer l'ID directement en tant que prop dans le composant
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;