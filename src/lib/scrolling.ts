/** Foydalanuvchi hozir scroll qilyaptimi? Fon canvas'lari shu vaqtda chizishni to'xtatib, scroll'ga joy beradi. */
let lastScroll = -1e9
window.addEventListener('scroll', () => { lastScroll = performance.now() }, { passive: true })
export const isScrolling = () => performance.now() - lastScroll < 180
