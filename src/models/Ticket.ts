export class Ticket {
    id?: number | string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'open' | 'in_progress' | 'resolved';
    createdAt?: string;

    constructor(data: any = {}) {
        this.id = data.id;
        this.title = data.title || '';
        this.description = data.description || '';
        this.priority = data.priority || 'low';
        this.status = data.status || 'open';
        this.createdAt = data.createdAt || new Date().toISOString();
    }

    get priorityBadgeClass(): string {
        switch (this.priority) {
            case 'high':
            case 'urgent':
                return 'bg-red-100 text-red-700 border-red-300';
            case 'medium':
                return 'bg-amber-100 text-amber-700 border-amber-300';
            default:
                return 'bg-emerald-100 text-emerald-700 border-emerald-300';
        }
    }

    get statusLabel(): string {
        const labels: Record<string, string> = {
            open: 'Ouvert',
            in_progress: 'En cours',
            resolved: 'Résolu'
        };
        return labels[this.status] || this.status;
    }
}