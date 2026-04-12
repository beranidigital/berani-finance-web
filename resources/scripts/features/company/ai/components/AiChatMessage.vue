<script setup lang="ts">
import { computed } from 'vue'
import type { AiChatMessage } from '@/scripts/types/ai-config'

const props = defineProps<{
  message: AiChatMessage
}>()

const isUser = computed(() => props.message.role === 'user')
</script>

<template>
  <div
    class="flex"
    :class="isUser ? 'justify-end' : 'justify-start'"
  >
    <div
      class="max-w-[85%] rounded-lg px-4 py-2 text-sm"
      :class="
        isUser
          ? 'bg-primary-500 text-white'
          : 'bg-surface-tertiary text-body'
      "
    >
      <!-- Plain text rendering for v1 — markdown support can ship later. -->
      <p class="whitespace-pre-wrap break-words">
        {{ message.content ?? '' }}
      </p>
    </div>
  </div>
</template>
