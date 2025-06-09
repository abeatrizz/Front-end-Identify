
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface CaseRequest {
  titulo: string;
  descricao: string;
}

export interface CaseResponse {
  _id: string;
  titulo: string;
  descricao: string;
  status: string;
  dataAbertura: string;
}

export interface UploadResponse {
  imagemUrl: string;
}

export interface ReportRequest {
  casoId: string;
  conteudo: string;
}

export interface ReportResponse {
  _id: string;
  casoId: string;
  conteudo: string;
}

export interface UserResponse {
  _id: string;
  username: string;
  email: string;
  role?: string;
}
