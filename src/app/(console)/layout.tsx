import type { ReactNode } from "react";
import ProjectRail from "@/components/console/ProjectRail";

export default function ConsoleLayout({ children }: { children: ReactNode }) {
  return (
    <div className="console-app console-theme">
      <ProjectRail />
      <div className="console-frame">
        <div className="console-panel">{children}</div>
      </div>
    </div>
  );
}
