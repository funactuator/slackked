import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import Quill, { Delta, Op, type QuillOptions } from "quill";
import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";
import { ImageIcon, Smile, XIcon } from "lucide-react";

import { Button } from "./ui/button";
import { Hint } from "./hint";

import "quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";
import { EmojiPopover } from "./emoji-popover";
import Image from "next/image";

type EditorValue = {
  image: File | null;
  body: string;
};

interface EditorProps {
  variant?: "create" | "update";
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  disabled?: boolean;
  innerRef?: RefObject<Quill | null>;
  defaultValue?: Delta | Op[];
}

const Editor = ({
  variant = "create",
  onCancel,
  onSubmit,
  placeholder = "Write something",
  defaultValue = [],
  disabled = false,
  innerRef
}: EditorProps) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  // Why this approach? using ref (something to do with useEffect and re renders)
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageElementRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    disabledRef.current = disabled;
    defaultValueRef.current = defaultValue;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] || null;

                const isEmpty = !addedImage && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
                if(isEmpty)return
                const body = JSON.stringify(quill.getContents());
                submitRef.current?.({image: addedImage, body})
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());
    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });
    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = "";
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  const toggleToolbar = () => {
    setIsToolbarVisible(!isToolbarVisible);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");
    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  const onEmojiSelect = (emoji) => {
    const quill = quillRef.current;
    quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
  };

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col">
      <input
        type="file"
        accept="image/*"
        ref={imageElementRef}
        onChange={(e) => setImage(e.target.files![0])}
        className="hidden"
      />
      <div className={cn("flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:bg-slate-300 focus-within:shadow-sm transition !bg-white", 
        disabled && 'opacity-50'
      )}>
        <div className="h-full ql-custom" ref={containerRef} />
        {!!image && (
          <div className="p-2">
            <div className="relative size-[62px] flex items-center justify-center group/image">
              <Hint label="Remove image">
                <button
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = "";
                  }}
                  className="hidden group-hover/image:flex rounded-full z-4 bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 border-2 border-white items-center justify-center"
                >
                  <XIcon className="size-3.5" />
                </button>
              </Hint>
              <Image
                src={URL.createObjectURL(image)}
                alt="uploaded"
                fill
                className="rounded-xl overflow-hidden border object-cover"
              />
            </div>
          </div>
        )}
        <div className="flex px-2 pb-2 z-[5]">
          <Hint
            label={isToolbarVisible ? "Hide formatting" : "Show formatting"}
          >
            <Button
              disabled={disabled}
              size="iconSm"
              variant="ghost"
              onClick={toggleToolbar}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button disabled={disabled} size="iconSm" variant="ghost">
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>
          {variant === "create" && (
            <Hint label="Image">
              <Button
                disabled={disabled}
                size="iconSm"
                variant="ghost"
                onClick={() => {
                  imageElementRef.current?.click();
                }}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {variant === "create" && (
            <Button
              disabled={disabled || isEmpty}
              onClick={() => onSubmit({
                body: JSON.stringify(quillRef.current?.getContents()),
                image
              })}
              size="iconSm"
              className={cn(
                "ml-auto",
                !isEmpty
                  ? "bg-[#007a5a] hover:bg-[#007a5a]/80 text-white hover:text-white"
                  : "bg-white hover:bg-white text-muted-foreground hover:text-white"
              )}
            >
              <MdSend className="size-4" />
            </Button>
          )}
          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button
                className=" bg-[#007a5a] hover:bg-[#007a5a]/80 text-white hover:text-white"
                variant="outline"
                size="sm"
                onClick={() => {}}
                disabled={disabled || isEmpty}
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </div>
      {variant === "create" && (
        <div
          className={cn(
            "p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition",
            !isEmpty && "opacity-100"
          )}
        >
          <p>
            <strong>Shift + Return</strong> to add a new line
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;
