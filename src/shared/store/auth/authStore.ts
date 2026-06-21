import { create } from 'zustand';
import { supabase } from '@infrastructure/persistence/supabaseClient';

export type UserRole = 'farmer' | 'cooperative' | 'ngo' | 'government' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  language: 'es' | 'qu' | 'en';
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string; phone: string; role: UserRole }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const ROLE_MAP: Record<number, UserRole> = {
  1: 'farmer',
  2: 'cooperative',
  3: 'ngo',
  4: 'government',
  5: 'admin',
};

const ROLE_REVERSE: Record<UserRole, number> = {
  farmer: 1,
  cooperative: 2,
  ngo: 3,
  government: 4,
  admin: 5,
};

function mapUser(row: any): User {
  return {
    id: row.id_usuario,
    name: `${row.nombres ?? ''} ${row.apellidos ?? ''}`.trim(),
    email: row.correo,
    phone: row.telefono ?? '',
    role: ROLE_MAP[row.id_rol] ?? 'farmer',
    language: row.idioma ?? 'es',
  };
}

export const useAuthStore = create<AuthState>((set, _get) => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) {
      supabase.from('usuarios').select('*').eq('id_usuario', session.user.id).maybeSingle().then(({ data }) => {
        if (data) {
          set({ isAuthenticated: true, user: mapUser(data), isLoading: false });
        } else {
          set({
            isAuthenticated: true,
            user: {
              id: session.user.id,
              name: session.user.email?.split('@')[0] ?? 'Usuario',
              email: session.user.email ?? '',
              phone: '',
              role: 'farmer' as UserRole,
              language: 'es',
            },
            isLoading: false,
          });
        }
      });
    } else {
      set({ isLoading: false });
    }
  });

  supabase.auth.onAuthStateChange((event, _session) => {
    if (event === 'SIGNED_OUT') {
      set({ isAuthenticated: false, user: null, isLoading: false });
    }
  });

  return {
    isAuthenticated: false,
    user: null,
    isLoading: true,

    login: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.session) return false;

      const { data: profile } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id_usuario', data.session.user.id)
        .single();

      if (profile) {
        set({ isAuthenticated: true, user: mapUser(profile) });
        return true;
      }
      return false;
    },

    register: async (data) => {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      if (error || !authData.user) {
        console.error('SignUp error:', error?.message);
        return false;
      }

      // Si signUp no devolvió sesión (ej: confirmación de email activada),
      // intentamos iniciar sesión directamente
      let user = authData.user;
      if (!authData.session) {
        const { data: si, error: siErr } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (siErr || !si.session) {
          console.error('Auto-login after register failed:', siErr?.message);
          return false;
        }
        user = si.session.user;
      }

      const nameParts = data.name.split(' ');
      const nombres = nameParts[0];
      const apellidos = nameParts.slice(1).join(' ') || '';

      const { error: rpcError } = await supabase.rpc('create_user_profile', {
        p_id_usuario: user.id,
        p_nombres: nombres,
        p_apellidos: apellidos,
        p_correo: data.email,
        p_telefono: data.phone,
        p_id_rol: ROLE_REVERSE[data.role],
        p_idioma: 'es',
      });
      if (rpcError) {
        console.error('Create profile RPC error:', rpcError.message);
        return false;
      }

      set({
        isAuthenticated: true,
        user: {
          id: user.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          language: 'es',
        },
      });
      return true;
    },

    logout: async () => {
      await supabase.auth.signOut();
      set({ isAuthenticated: false, user: null });
    },

    updateUser: async (data) => {
      if (data.language) {
        const user = _get().user;
        if (user) {
          await supabase.from('usuarios').update({ idioma: data.language }).eq('id_usuario', user.id);
        }
      }
      set((state) => ({
        user: state.user ? { ...state.user, ...data } : null,
      }));
    },
  };
});
