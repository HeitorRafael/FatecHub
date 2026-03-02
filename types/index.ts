export type UserRole = 'ADMIN' | 'ESTUDANTE' | 'EMPRESA';

export interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

export interface AuthUser {
    id: string;
    email: string;
    nome: string;
    role: UserRole;
    foto?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: AuthUser;
}

export interface RegisterEstudanteRequest {
    email: string;
    password: string;
    nome: string;
    ra: string;
    emailSecundario?: string;
    telefoneMestre: string;
    mestre: string;
    curso: string;
}

export interface RegisterEmpresaRequest {
    email: string;
    password: string;
    nomeEmpresa: string;
    telephoneContato: string;
    emailContato: string;
    enderecoEmpresa: string;
    nomeResponsavel: string;
}
