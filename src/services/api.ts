const API_BASE_URL = 'http://localhost:8000'; // Remplacez par l'URL de votre API si besoin

export const apiService = {
    // Récupérer la liste des tickets avec support des filtres (status, priority, title, page)
    async getTickets(params: Record<string, any> = {}) {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/api/tickets?${query}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des tickets');
        return await response.json();
    },

    // Récupérer un ticket spécifique par son ID
    async getTicket(id: string | number) {
        const response = await fetch(`${API_BASE_URL}/api/tickets/${id}`);
        if (!response.ok) throw new Error('Ticket introuvable');
        return await response.json();
    },

    // Créer un nouveau ticket
    async createTicket(ticketData: { title: string; description: string; priority: string }) {
        const response = await fetch(`${API_BASE_URL}/api/tickets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ticketData)
        });
        if (!response.ok) throw new Error('Erreur lors de la création du ticket');
        return await response.json();
    },

    // Mettre à jour partiellement un ticket (PATCH avec le header obligatoire)
    async updateTicket(id: string | number, updateData: Record<string, any>) {
        const response = await fetch(`${API_BASE_URL}/api/tickets/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/merge-patch+json'
            },
            body: JSON.stringify(updateData)
        });
        if (!response.ok) throw new Error('Erreur lors de la mise à jour du ticket');
        return await response.json();
    },

    // Supprimer un ticket (attend un code 204 en cas de succès)
    async deleteTicket(id: string | number) {
        const response = await fetch(`${API_BASE_URL}/api/tickets/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok && response.status !== 204) {
            throw new Error('Erreur lors de la suppression du ticket');
        }
        return true;
    }
};