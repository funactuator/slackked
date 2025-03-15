import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef } from "react";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);
  const [editorKey, setEditorKey] = useState(0);

  const { mutate: createMessage } = useCreateMessage();
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      console.log({ body, image });
      createMessage(
        {
          body,
          channelId,
          workspaceId,
        },
        { throwError: true }
      );
      setEditorKey((prevKey: number) => prevKey + 1);
    } catch (error) {
    } finally {
    }
  };

  return (
    <div className="px-5 w-full">
      <Editor
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={false}
        innerRef={editorRef}
        variant="create"
        editorKey={editorKey}
      />
    </div>
  );
};
