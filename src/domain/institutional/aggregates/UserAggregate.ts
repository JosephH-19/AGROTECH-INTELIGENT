import { AggregateRoot } from '@domain/shared/aggregates/AggregateRoot';
import { User } from '@domain/institutional/entities/User';

export class UserAggregate extends AggregateRoot {
  constructor(public readonly root: User) {
    super();
  }

  assignRole(roleId: string): void {
    // Placeholder: lógica de agregación de roles.
    this.addEvent({ eventName: 'RoleAssigned', occurredOn: new Date(), payload: { roleId } });
  }
}
