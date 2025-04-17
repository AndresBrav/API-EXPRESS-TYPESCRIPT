export type TypeUser = 'admin' | 'user';

export type addUserBD = {
  login: string;
  clave: string;
  sts: string;
  tipo: TypeUser;
};

export type updateUserBD ={
  id?:string,
  login?: string;
  clave?: string;
  sts?: string;
  tipo?: string;
}

