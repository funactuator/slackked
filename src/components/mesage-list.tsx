import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";

import { GetMessagesReturnType } from "@/features/messages/api/use-get-messages";
import { Message } from "./message";

const TIME_THRESHOLD = 5;

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data: GetMessagesReturnType | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM, d");
};

export const MessageList = ({
  memberImage,
  memberName,
  channelCreationTime,
  channelName,
  variant = "channel",
  loadMore,
  isLoadingMore,
  canLoadMore,
  data,
}: MessageListProps) => {
  const groupedMessages = data?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [message];
      } else {
        groups[dateKey].unshift(message);
      }
      return groups;
    },
    {} as Record<string, typeof data>
  );
  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="relative my-2 text-center">
            <hr className="absolute top-1/2 left-0 right-0 border-t bg-gray-300" />
            <span className="relative inline-block text-xs bg-white px-4 py-1 rounded-full border border-gray-300 shadow-sm">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {messages.map((message, index) => {
            const prevMessage = messages[index-1];
            const isCompact = prevMessage && prevMessage.user._id === message.user._id && 
            differenceInMinutes(message._creationTime, prevMessage._creationTime) < 5;
            return (
              <Message
                key={message._id}
                id={message._id}
                memberId={message.member._id}
                authorImage={message.user.image}
                authorName={message.user.name}
                isAuthor={false}
                reactions={message.reactions}
                body={message.body}
                image={message.image}
                isEditing={false}
                setEditingId={() => {}}
                isCompact={isCompact}
                hideThreadButton={false}
                updatedAt={message.updatedAt}
                createdAt={message._creationTime}
                threadCount={message.threadCount}
                threadImage={message.threadImage}
                threadTimestamp={message.threadTimestamp}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
