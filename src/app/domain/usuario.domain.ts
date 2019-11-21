export interface Usuario {
  username?: string;
  name?: string;
  email?: string;
  avatar?: string;
  roles?: Array<string>;
  id?: string;
  password?: string;
  newPassword?: string;
  newRetypedPassword?: string;
  oldPassword?: string;
  confirmationToken?: string;
  enabled?: boolean;
  passwordChangeDate?: Date;

}
