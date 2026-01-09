
export interface Session {
  [key: string]: string;
}

export interface Horarios {
  jueves?: Session;
  viernes?: Session;
  sabado?: Session;
  /* Fixed: Made domingo optional and using Session type to support flexible race schedules (e.g. Las Vegas) */
  domingo?: Session;
}

export interface Race {
  pais: string;
  circuito: string;
  fechas: string;
  formato?: string;
  horarios: Horarios;
}