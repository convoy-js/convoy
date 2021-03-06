import { Handlers } from '@convoy/common';

import { DomainEventHandler } from './domain-event-handler';

export class DomainEventHandlers extends Handlers<DomainEventHandler<any>> {
  getAggregateTypesAndEvents(): readonly string[] {
    return this.handlers.map(handler => handler.aggregateType);
  }
}
