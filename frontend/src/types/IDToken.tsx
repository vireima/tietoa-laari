export interface IDToken {
  client_id: string;
  at_hash: string;
  iss: string;
  exp: number;
  iat: number;
}
