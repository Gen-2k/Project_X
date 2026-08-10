export class UserDto {
  id!: string;
  email!: string;
  name!: string | null;
}

export class AuthResponseDto {
  user!: UserDto;
  message!: string;
}

export class LogoutResponseDto {
  message!: string;
}
