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

export type ServicoTipo = 'DESIGN' | 'DESENVOLVIMENTO' | 'CONSULTORIA' | 'MARKETING' | 'GESTAO_PROJETOS' | 'ANALISE_DADOS' | 'TRADUCAO' | 'REDACAO' | 'TUTORIA' | 'OUTRO';

export type FaixaPreco = 'VINTE_CINQUENTA' | 'CINQUENTA_CEM' | 'CEM_DUZENTOS' | 'DUZENTOS_QUINHENTOS' | 'QUINHENTOS_MIL';

export type StatusServico = 'ATIVO' | 'PAUSADO' | 'ENCERRADO' | 'ARCHIVED';

export interface Servico {
    id: string;
    empresaId: string;
    titulo: string;
    tipo: ServicoTipo;
    descricao: string;
    faixaPreco: FaixaPreco;
    imagemUrl?: string;
    dataInicio: Date;
    dataFim: Date;
    duracao: number; // em semanas (máximo 4)
    status: StatusServico;
    criadoEm: Date;
    atualizadoEm: Date;
}

export interface CreateServicoRequest {
    titulo: string;
    tipo: ServicoTipo;
    descricao: string;
    faixaPreco: FaixaPreco;
    imagemUrl?: string;
    dataInicio: string; // ISO date
    dataFim: string; // ISO date
    duracao: number;
}

export interface UpdateServicoRequest extends Partial<CreateServicoRequest> {
    status?: StatusServico;
}
