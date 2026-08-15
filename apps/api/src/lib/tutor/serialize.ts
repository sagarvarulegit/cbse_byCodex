import type { TutorAttachment, TutorConversation, TutorMessage } from '@prisma/client';

export type ConversationWithMessages = TutorConversation & {
  messages: Array<
    TutorMessage & { attachments: TutorAttachment[] }
  >;
};

export function serializeConversationSummary(conversation: TutorConversation) {
  return {
    id: conversation.id,
    title: conversation.title,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  };
}

export function serializeConversationDetail(conversation: ConversationWithMessages) {
  return {
    id: conversation.id,
    title: conversation.title,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    messages: conversation.messages.map((message) => ({
      id: message.id,
      role: message.role,
      contentMarkdown: message.contentMarkdown,
      citedChunkIds: message.citedChunkIds as string[] | null,
      createdAt: message.createdAt,
      attachments: message.attachments.map((attachment) => ({
        id: attachment.id,
        kind: attachment.kind,
        mimeType: attachment.mimeType,
        sizeBytes: attachment.sizeBytes,
        fileName: attachment.fileName,
      })),
    })),
  };
}
