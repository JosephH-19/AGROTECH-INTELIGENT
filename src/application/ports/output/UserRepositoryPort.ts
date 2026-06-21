import { User } from '@domain/institutional/entities/User';

export interface UserRepositoryPort {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
