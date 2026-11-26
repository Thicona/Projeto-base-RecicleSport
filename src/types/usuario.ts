// src/types/usuario.ts
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  pontosReciclagem: number;
  fotoPerfilUri?: string;
}

export interface DescarteRegistro {
  count: number;
  uri: string | null;
}
