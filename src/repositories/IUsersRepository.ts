import { User } from '../entities/User'

export interface IUserQuery {
  page?: number;
  limit?: number;
}

export interface IUsersRepository {
    findAll(params: IUserQuery): Promise<{users: User[], totalItems: number, totalPages: number, page: number, limit: number}>;
    findByLogin(login: string): Promise<User>;
    save(user: User): Promise<boolean>;
    delete(user: User): Promise<boolean>;
    deleteAll(): Promise<void>;
}
