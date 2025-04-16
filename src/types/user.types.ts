export type TypeUser = 'admin' | 'user';

export type addUserBD = {
  login: string;
  clave: string;
  sts: string;
  tipo: TypeUser;
};

