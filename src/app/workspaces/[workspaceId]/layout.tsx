"use client";

import {
  ResizablePanelGroup,
  ResizableHandle,
  ResizablePanel,
} from "@/components/ui/resizable";

import { Sidebar } from "./components/sidebar";
import { Toolbar } from "./components/toolbar";
import { WorkspaceSidebar } from "./components/WorkspaceSidebar";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="ca-workspace-layout"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#5E2C5F]"
          >
            <div>
              <WorkspaceSidebar />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceIdLayout;
