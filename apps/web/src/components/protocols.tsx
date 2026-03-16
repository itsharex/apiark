"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const protocols = [
  {
    name: "REST",
    color: "#22c55e",
    method: "GET",
    url: "/api/users",
    description: "Full HTTP client with every method, headers, params, auth, cookies, and body type. Color-coded methods. cURL import/export.",
    response: `{
  "users": [
    { "id": 1, "name": "Sarah Chen", "role": "admin" },
    { "id": 2, "name": "Marcus J.", "role": "dev" }
  ],
  "total": 2
}`,
    status: "200 OK",
    time: "45ms",
  },
  {
    name: "GraphQL",
    color: "#ec4899",
    method: "GQL",
    url: "/graphql",
    description: "Schema introspection, auto-complete, variables editor, and schema explorer. Write queries with full IDE support.",
    response: `{
  "data": {
    "user": {
      "name": "Sarah Chen",
      "orders": [
        { "id": "ord_9x2k", "total": 149.99 }
      ]
    }
  }
}`,
    status: "200 OK",
    time: "89ms",
  },
  {
    name: "gRPC",
    color: "#3b82f6",
    method: "RPC",
    url: "grpc://api:50051",
    description: "Load .proto files or use server reflection. Unary, server streaming, client streaming, and bidirectional calls.",
    response: `{
  "user": {
    "user_id": "usr_k8x2m",
    "display_name": "Sarah Chen",
    "role": "ADMIN",
    "is_active": true
  }
}`,
    status: "OK (0)",
    time: "12ms",
  },
  {
    name: "WebSocket",
    color: "#eab308",
    method: "WS",
    url: "wss://api/ws",
    description: "Real-time bidirectional messaging with auto-reconnect, message history, and formatted message viewer.",
    response: `▶ {"type":"msg","user":"Sarah","text":"Hey!"}
▶ {"type":"msg","user":"Marcus","text":"Hi"}
◀ {"type":"msg","text":"Confirmed"}
▶ {"type":"msg","user":"Marcus","text":"Ship it"}`,
    status: "Connected",
    time: "Live",
  },
  {
    name: "SSE",
    color: "#06b6d4",
    method: "SSE",
    url: "/events/stream",
    description: "Server-Sent Events with real-time stream viewer, event type filtering, and auto-reconnect.",
    response: `event: update
data: {"cpu": 45.2, "memory": 62.1}

event: update
data: {"cpu": 43.8, "memory": 61.9}

event: alert
data: {"level": "warn", "msg": "High load"}`,
    status: "Streaming",
    time: "Live",
  },
  {
    name: "MQTT",
    color: "#8b5cf6",
    method: "PUB",
    url: "mqtt://broker:1883",
    description: "Publish/subscribe messaging with topic management, QoS levels, and retained message support.",
    response: `Topic: sensors/temp/living-room
QoS: 1
Payload: {"temp": 22.5, "unit": "C"}

Topic: sensors/temp/bedroom
QoS: 1
Payload: {"temp": 20.1, "unit": "C"}`,
    status: "Subscribed",
    time: "Live",
  },
];

function MiniAppWindow({ protocol }: { protocol: (typeof protocols)[0] }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[var(--color-surface)] overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-1.5 px-3.5 py-2 bg-[var(--color-bg)] border-b border-white/[0.06]">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#eab308]/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/80" />
        <span className="ml-2 text-[10px] text-zinc-600 font-mono">ApiArk</span>
      </div>

      {/* URL bar */}
      <div className="flex items-center gap-2.5 px-3.5 py-2 border-b border-white/[0.06]">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded font-mono"
          style={{ color: protocol.color, background: `${protocol.color}12` }}
        >
          {protocol.method}
        </span>
        <span className="text-[11px] text-zinc-500 font-mono truncate">{protocol.url}</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] font-semibold" style={{ color: "#22c55e" }}>
            {protocol.status}
          </span>
          <span className="text-[10px] text-zinc-600 font-mono">{protocol.time}</span>
        </div>
      </div>

      {/* Response */}
      <div className="p-3.5 font-mono text-[10px] leading-relaxed text-zinc-400 h-40 overflow-hidden">
        {protocol.response.split("\n").map((line, i) => (
          <div key={i}>
            <span className="text-zinc-700 select-none mr-3 inline-block w-4 text-right">{i + 1}</span>
            <span
              dangerouslySetInnerHTML={{
                __html: line
                  .replace(/"([^"]+)":/g, '<span style="color:#818cf8">"$1"</span>:')
                  .replace(/: "([^"]+)"/g, ': <span style="color:#34d399">"$1"</span>')
                  .replace(/: (\d+\.?\d*)/g, ': <span style="color:#fbbf24">$1</span>')
                  .replace(/: (true|false)/g, ': <span style="color:#f472b6">$1</span>')
                  .replace(/(▶|◀)/g, '<span style="color:#6366f1">$1</span>')
                  .replace(/(event|data|Topic|QoS|Payload):/g, '<span style="color:#818cf8">$1</span>:'),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Protocols() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [active, setActive] = useState(0);

  return (
    <section ref={ref} id="protocols" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="mb-16"
        >
          <p className="section-label mb-4">_protocols</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Every protocol. <span className="text-indigo-400">One interface.</span>
          </h2>
          <p className="text-base text-zinc-500 max-w-xl">
            REST, GraphQL, gRPC, WebSocket, SSE, MQTT &mdash; all with the same experience.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Protocol list */}
          <div className="space-y-1.5">
            {protocols.map((proto, i) => (
              <motion.button
                key={proto.name}
                initial={{ opacity: 0, x: -12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                onClick={() => setActive(i)}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                  i === active
                    ? "bg-white/[0.03] border-white/[0.08]"
                    : "bg-transparent border-transparent hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded font-mono"
                    style={{ color: proto.color, background: `${proto.color}12` }}
                  >
                    {proto.method}
                  </span>
                  <span className={`text-sm font-medium ${i === active ? "text-white" : "text-zinc-400"}`}>
                    {proto.name}
                  </span>
                  <span className="ml-auto text-[10px] text-zinc-600 font-mono">{proto.url}</span>
                </div>
                {i === active && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-zinc-500 mt-2 leading-relaxed"
                  >
                    {proto.description}
                  </motion.p>
                )}
              </motion.button>
            ))}
          </div>

          {/* Right: Mini app window */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="sticky top-32"
          >
            <MiniAppWindow protocol={protocols[active]} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
