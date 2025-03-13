"use client";

import Image from "next/image";
import VerificationInput from "react-verification-input";

const JoinPage = () => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center bg-white px-8 rounded-lg shadow-md">
      <Image className="-mt-20" src="/logo.svg" alt="logo" width={60} height={60} />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Join Workspace</h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join{" "}
          </p>
        </div>
        <VerificationInput
          classNames={{
            container: "verification-container",
            character: "verification-character",
            characterInactive: "verification-character-inactive",
            characterSelected: "verification-character-selected",
            characterFilled: "verification-character-filled",
          }}
        />
      </div>
    </div>
  );
};

export default JoinPage;
