export type AuthActionState = {
  error: string | null;
  ok: boolean;
};

export const initialAuthActionState: AuthActionState = { error: null, ok: false };
