import { User } from '../../entities/User'

export interface IAuthenticationCredentialsDTO {
    login: string;
    password: string;
}
export interface IAuthProvider {
    authenticate(credentials: IAuthenticationCredentialsDTO): Promise<User>;
}
