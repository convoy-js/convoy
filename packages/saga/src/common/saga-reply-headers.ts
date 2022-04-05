import { CommandMessageHeaders } from '@convoy/command';

import { SagaCommandHeaders } from './saga-command-headers';

export class SagaReplyHeaders {
  static readonly REPLY_SAGA_TYPE = CommandMessageHeaders.inReply(
    SagaCommandHeaders.SAGA_TYPE,
  );
  static readonly REPLY_SAGA_ID = CommandMessageHeaders.inReply(
    SagaCommandHeaders.SAGA_ID,
  );

  static readonly REPLY_LOCKED = 'saga_locked_target';
}
