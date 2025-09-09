// 延时
export function manualDelay(delay = 500) {
  return new Promise(resolve => setTimeout(resolve, delay))
}
// 提示
export function shining(message, color = 'rgb(50, 177, 108)', fontSize = 'xxx-large') {
  if (!message) return
  const i = document.createElement('span')
  i.textContent = message
  i.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    color: ${color};
    font-size: ${fontSize};
    font-weight: bold;
    transform: translate(-50%, -50%);
    user-select: none;
    z-index: 2002;`
  document.body.appendChild(i)
  const duration = 2500
  i.animate(
    [{ top: '50%', opacity: 1 }, { top: '30%', opacity: 0 }],
    { duration, fill: 'forwards' }
  )
  setTimeout(i.remove, duration)
}