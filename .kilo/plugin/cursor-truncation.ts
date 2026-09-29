import type { Plugin } from "@kilocode/plugin"

// Configuration constants for strict context enforcement inside Kilo
const MAX_TAIL_MESSAGES = 12             // Lowered from 24 to forcefully prevent Kilo pre-flight 400 errors
const TOOL_TRUNCATE_CHAR_LIMIT = 800     // Aggressive cap on old tool outputs
const TEXT_TRUNCATE_CHAR_LIMIT = 2000    // Safety cap on historical text messages
const TRUNCATION_SUFFIX = "\n... [Truncated by Cursor-Style Context Plugin]"

const cursorTruncationServer: Plugin = async () => {
  console.log("🟢 [Plugin Loaded] Cursor-Style Truncation plugin is active!")

  return {
    "experimental.chat.messages.transform": async (_input, output) => {
      const msgs = output.messages
      if (!msgs || msgs.length <= 1) return

      // 1. Strict Sliding Window Truncation
      if (msgs.length > MAX_TAIL_MESSAGES) {
        const dropCount = msgs.length - MAX_TAIL_MESSAGES
        msgs.splice(1, dropCount)
      }

      // 2. In-Place Content Pruning (Leaving the last 2 active turns untouched)
      const pruneBoundary = Math.max(1, msgs.length - 2)

      for (let i = 1; i < pruneBoundary; i++) {
        const msg = msgs[i]
        if (!msg) continue

        if (msg.role === "tool") {
          if (typeof msg.content === "string") {
            if (msg.content.length > TOOL_TRUNCATE_CHAR_LIMIT) {
              msg.content = msg.content.slice(0, TOOL_TRUNCATE_CHAR_LIMIT) + TRUNCATION_SUFFIX
            }
          } else if (Array.isArray(msg.content)) {
            for (let j = 0; j < msg.content.length; j++) {
              const part = msg.content[j]
              if (
                part &&
                typeof part === "object" &&
                part.type === "text" &&
                typeof part.text === "string" &&
                part.text.length > TOOL_TRUNCATE_CHAR_LIMIT
              ) {
                part.text = part.text.slice(0, TOOL_TRUNCATE_CHAR_LIMIT) + TRUNCATION_SUFFIX
              }
            }
          }
        } else {
          if (typeof msg.content === "string" && msg.content.length > TEXT_TRUNCATE_CHAR_LIMIT) {
            msg.content = msg.content.slice(0, TEXT_TRUNCATE_CHAR_LIMIT) + TRUNCATION_SUFFIX
          } else if (Array.isArray(msg.content)) {
            for (let j = 0; j < msg.content.length; j++) {
              const part = msg.content[j]
              if (
                part &&
                typeof part === "object" &&
                part.type === "text" &&
                typeof part.text === "string" &&
                part.text.length > TEXT_TRUNCATE_CHAR_LIMIT
              ) {
                part.text = part.text.slice(0, TEXT_TRUNCATE_CHAR_LIMIT) + TRUNCATION_SUFFIX
              }
            }
          }
        }
      }
    },
  }
}

export default {
  id: "cursor-style-truncation",
  server: cursorTruncationServer,
}
