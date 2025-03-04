import type { Notification } from '../types/notification.js';
export declare function useToast(): {
    add: (notification: Partial<Notification>) => {
        id: string;
        title?: string;
        description?: string;
        icon?: string;
        avatar?: import("../types").Avatar;
        closeButton?: import("../types").Button;
        timeout?: number;
        actions?: import("../types").NotificationAction[];
        click?: (...args: any[]) => void;
        callback?: (...args: any[]) => void;
        color?: import("../types").NotificationColor;
        ui?: any;
    };
    remove: (id: string) => void;
    update: (id: string, notification: Partial<Notification>) => void;
    clear: () => void;
};
