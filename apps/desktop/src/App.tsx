import { UrlBar } from "@/components/request/url-bar";
import { RequestPanel } from "@/components/request/request-panel";
import { ResponsePanel } from "@/components/response/response-panel";

function App() {
  return (
    <div className="flex h-screen bg-[#0a0a0b] text-[#e4e4e7]">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-[#2a2a2e] bg-[#141416]">
        <div className="flex h-12 items-center gap-2 border-b border-[#2a2a2e] px-4">
          <span className="text-lg font-semibold text-[#3b82f6]">ApiArk</span>
        </div>
        <div className="flex-1 p-4">
          <p className="text-sm text-[#a1a1aa]">
            No collections yet. Open a folder or import a collection to get
            started.
          </p>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* URL Bar */}
        <UrlBar />

        {/* Request + Response split */}
        <div className="flex flex-1 overflow-hidden">
          {/* Request panel (top half) */}
          <div className="flex w-1/2 flex-col border-r border-[#2a2a2e]">
            <RequestPanel />
          </div>

          {/* Response panel (bottom half) */}
          <div className="flex w-1/2 flex-col">
            <ResponsePanel />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
