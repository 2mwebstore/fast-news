<script setup lang="ts">
/**
 * Article body editor (§15).
 *
 * A contenteditable surface with the block and inline formats the spec lists.
 * Whatever this produces is sanitised again on the server on every save — the
 * editor is a convenience, never the security boundary.
 */
const model = defineModel<string>({ required: true })

const { t } = useAdminLocale()

const editor = ref<HTMLElement | null>(null)
const showHtml = ref(false)

// Seed the editable surface once. Binding innerHTML reactively would move the
// caret to the start on every keystroke.
onMounted(() => {
  if (editor.value) editor.value.innerHTML = model.value || '<p><br></p>'
})

watch(model, (next) => {
  if (editor.value && !showHtml.value && editor.value.innerHTML !== next) {
    editor.value.innerHTML = next || '<p><br></p>'
  }
})

function sync() {
  if (editor.value) model.value = editor.value.innerHTML
}

function exec(command: string, value?: string) {
  editor.value?.focus()
  document.execCommand(command, false, value)
  sync()
}

function insertLink() {
  const url = window.prompt('តំណ URL:')
  if (!url) return
  // Only http(s) links: a javascript: href here would be stripped server-side,
  // but there is no reason to let an editor create one.
  if (!/^https?:\/\//i.test(url)) {
    window.alert('សូមបញ្ចូល URL ដែលចាប់ផ្តើមដោយ http:// ឬ https://')
    return
  }
  exec('createLink', url)
}

function insertBlock(html: string) {
  exec('insertHTML', html)
}

// Computed so the tooltips follow the admin language. The labels stay as
// symbols: they read the same in both languages and keep the bar compact.
const toolbar = computed(() => [
  { label: 'H2', title: t('rtHeading'), action: () => exec('formatBlock', '<h2>') },
  { label: 'H3', title: t('rtSubheading'), action: () => exec('formatBlock', '<h3>') },
  { label: '¶', title: t('rtParagraph'), action: () => exec('formatBlock', '<p>') },
  { label: 'B', title: t('rtBold'), action: () => exec('bold'), cls: 'font-bold' },
  { label: 'I', title: t('rtItalic'), action: () => exec('italic'), cls: 'italic' },
  { label: '❝', title: t('rtQuote'), action: () => exec('formatBlock', '<blockquote>') },
  { label: '•', title: t('rtBullets'), action: () => exec('insertUnorderedList') },
  { label: '1.', title: t('rtNumbers'), action: () => exec('insertOrderedList') },
  { label: '🔗', title: t('rtLink'), action: insertLink },
  { label: '―', title: t('rtDivider'), action: () => insertBlock('<hr>') },
  { label: '▦', title: t('rtTable'), action: () => insertBlock(
      // Empty header cells: whatever placeholder text went here would have to
      // be deleted in every table, in whichever language it was written.
      '<table><thead><tr><th></th><th></th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table><p><br></p>',
    ) },
])

/**
 * Pasting from Word or a news site drags in styles, classes and sometimes
 * scripts. Forcing plain text keeps the stored HTML to the structure this
 * editor produces.
 */
function onPaste(event: ClipboardEvent) {
  event.preventDefault()
  const text = event.clipboardData?.getData('text/plain') ?? ''
  document.execCommand('insertText', false, text)
  sync()
}
</script>

<template>
  <div class="rounded-lg border border-line">
    <div class="flex flex-wrap items-center gap-1 border-b border-line bg-surface-muted p-1.5">
      <button
        v-for="item in toolbar" :key="item.label"
        type="button" :title="item.title"
        :class="['min-w-[2rem] rounded px-2 py-1 text-sm hover:bg-surface', item.cls]"
        @click="item.action"
      >{{ item.label }}</button>

      <button
        type="button"
        :class="['ml-auto rounded px-2 py-1 text-xs', showHtml ? 'bg-brand text-white' : 'hover:bg-surface']"
        @click="showHtml = !showHtml"
      >HTML</button>
    </div>

    <textarea
      v-if="showHtml"
      v-model="model"
      rows="18"
      class="w-full p-3 font-mono text-xs outline-none"
      spellcheck="false"
    />

    <div
      v-else
      ref="editor"
      class="article-body min-h-[26rem] p-4 outline-none"
      contenteditable="true"
      role="textbox"
      aria-multiline="true"
      :aria-label="t('bodyLabel')"
      @input="sync"
      @blur="sync"
      @paste="onPaste"
    />
  </div>
</template>
