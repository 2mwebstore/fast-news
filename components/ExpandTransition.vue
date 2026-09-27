<script setup lang="ts">
/**
 * Height transition for content that opens in place (header search, mobile
 * nav). CSS cannot transition to `height: auto`, so the hooks measure the
 * content, animate to its real height, then hand back to `auto` so it can
 * still reflow once open.
 *
 * The wrapped element must not carry vertical padding or a border itself:
 * with `box-sizing: border-box` those keep it from collapsing to zero. Put
 * them on a child instead.
 */
function setHeight(el: Element, height: string) {
  const e = el as HTMLElement
  e.style.height = height
  e.style.overflow = 'hidden'
}

function clear(el: Element) {
  const e = el as HTMLElement
  e.style.height = ''
  e.style.overflow = ''
}

function enter(el: Element) {
  setHeight(el, '0px')
  // Force a layout so the browser commits the zero height before the target.
  void (el as HTMLElement).offsetHeight
  setHeight(el, `${el.scrollHeight}px`)
}

function leave(el: Element) {
  setHeight(el, `${el.scrollHeight}px`)
  void (el as HTMLElement).offsetHeight
  setHeight(el, '0px')
}
</script>

<template>
  <Transition
    name="expand"
    @enter="enter"
    @after-enter="clear"
    @enter-cancelled="clear"
    @leave="leave"
    @after-leave="clear"
    @leave-cancelled="clear"
  >
    <slot />
  </Transition>
</template>

<style>
.expand-enter-active {
  transition: height 0.32s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.24s ease-out;
}
.expand-leave-active {
  transition: height 0.22s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.16s ease-in;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
}
</style>
