import { Message } from './message';
import { MessageProducer } from './message-producer';
import { MessageMissingRequiredIDException } from './exceptions';

export class InternalMessageProducer {
  constructor(
    private readonly target: MessageProducer,
    private readonly messageInterceptors: readonly any[] = [],
  ) {}

  private prepareMessageHeaders<M extends Message<any>>(
    destination: string,
    message: M,
  ): M {
    const id = this.target.generateMessageId();
    if (!id && !message.hasHeader(Message.ID)) {
      throw new MessageMissingRequiredIDException(message);
    } else {
      message.setHeader(Message.ID, id);
    }

    return message
      .setHeader(Message.DESTINATION, destination)
      .setHeader(Message.DATE, new Date().toJSON());
  }

  async sendBatch(
    destination: string,
    messages: readonly Message<any>[],
    isEvent = false,
  ): Promise<void> {
    messages = messages.map(message =>
      this.prepareMessageHeaders(destination, message),
    );

    /*for (const message of messages) {
      await this.preSend(message);
    }*/

    try {
      Message.logger.debug(
        `Sending messages ${messages.map(message =>
          message.toString(),
        )} to destination ${destination}`,
      );
      await this.target.sendBatch(destination, messages, isEvent);
      /*for (const message of messages) {
        await this.postSend(message);
      }*/
    } catch (err: any) {
      Message.logger.error(err.message);
      /*for (const message of messages) {
        await this.postSend(message);
      }*/
      throw err;
    }
  }

  async send(
    destination: string,
    message: Message<any>,
    isEvent = false,
  ): Promise<void> {
    this.prepareMessageHeaders(destination, message);

    // await this.preSend(message);
    try {
      Message.logger.debug(
        `Sending message ${message.toString()} to destination ${destination}`,
      );
      await this.target.send(destination, message, isEvent);
      // await this.postSend(message);
    } catch (err: any) {
      Message.logger.error(err.message);
      // await this.postSend(message, err);
      throw err;
    }
  }
}
