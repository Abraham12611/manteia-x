import { create } from 'zustand';
import { supabase } from './supabase';

interface UserProfile {
    id: string;
    wallet_address: string;
    company_name: string | null;
    logo_url: string | null;
    role: 'lender' | 'borrower' | null;
}

interface AppState {
    userProfile: UserProfile | null;
    isProfileLoading: boolean;
    fetchProfile: (address: string) => Promise<void>;
    updateProfile: (address: string, data: { company_name?: string; logo_url?: string; role?: 'lender' | 'borrower' }) => Promise<void>;
    setRole: (role: 'lender' | 'borrower') => void;
    resetProfile: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    userProfile: null,
    isProfileLoading: false,

    fetchProfile: async (address: string) => {
        set({ isProfileLoading: true });
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('wallet_address', address)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error);
            }

            if (data) {
                set({ userProfile: data });
            } else {
                set({ userProfile: null });
            }
        } catch (err) {
            console.error('Unexpected error fetching profile:', err);
        } finally {
            set({ isProfileLoading: false });
        }
    },

    updateProfile: async (address: string, updates) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .upsert({
                    wallet_address: address,
                    ...updates
                }, { onConflict: 'wallet_address' })
                .select()
                .single();

            if (error) throw error;
            if (data) set({ userProfile: data });

        } catch (err) {
            console.error('Error updating profile:', err);
            throw err;
        }
    },

    setRole: (role) => {
        const profile = get().userProfile;
        if (profile) {
            set({ userProfile: { ...profile, role } });
        }
    },

    resetProfile: () => set({ userProfile: null }),
}));

// Export alias for compatibility if needed, though useAppStore is the main entry
export const useUserStore = useAppStore;
