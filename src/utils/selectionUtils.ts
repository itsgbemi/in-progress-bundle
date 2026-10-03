
export function getCharacterOffsetInContainer(container: HTMLElement, targetNode: Node, targetOffset: number): number {
  if (!container || !targetNode) return 0;
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
  let totalOffset = 0;
  let currentNode: Node | null = walker.nextNode();

  while (currentNode) {
    if (currentNode === targetNode) {
      return totalOffset + Math.min(targetOffset, currentNode.textContent?.length || 0);
    }
    totalOffset += currentNode.textContent?.length || 0;
    currentNode = walker.nextNode();
  }

  if (targetNode.nodeType === Node.ELEMENT_NODE) {
    let charCount = 0;
    const childNodes = Array.from(targetNode.childNodes);
    for (let i = 0; i < Math.min(targetOffset, childNodes.length); i++) {
      charCount += childNodes[i].textContent?.length || 0;
    }
    return charCount;
  }

  return totalOffset;
}

export function getSelectionOffsets(container: HTMLElement): { start: number; end: number } | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || !container) return null;

  try {
    const range = sel.getRangeAt(0);
    if (!container.contains(range.commonAncestorContainer)) return null;

    const start = getCharacterOffsetInContainer(container, range.startContainer, range.startOffset);
    const end = getCharacterOffsetInContainer(container, range.endContainer, range.endOffset);

    return { start: Math.min(start, end), end: Math.max(start, end) };
  } catch {
    return null;
  }
}

export function restoreSelectionFromOffsets(container: HTMLElement, start: number, end: number): boolean {
  if (!container) return false;

  try {
    container.focus();
  } catch {
    
  }

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
  let currentOffset = 0;
  let startNode: Node | null = null;
  let startNodeOffset = 0;
  let endNode: Node | null = null;
  let endNodeOffset = 0;

  let currentNode: Node | null = walker.nextNode();
  let lastTextNode: Node | null = null;

  while (currentNode) {
    const len = currentNode.textContent?.length || 0;
    lastTextNode = currentNode;

    if (!startNode && currentOffset + len >= start) {
      startNode = currentNode;
      startNodeOffset = Math.max(0, start - currentOffset);
    }

    if (!endNode && currentOffset + len >= end) {
      endNode = currentNode;
      endNodeOffset = Math.max(0, end - currentOffset);
    }

    currentOffset += len;
    if (startNode && endNode) break;
    currentNode = walker.nextNode();
  }

  if (!startNode && lastTextNode) {
    startNode = lastTextNode;
    startNodeOffset = lastTextNode.textContent?.length || 0;
  }
  if (!endNode && lastTextNode) {
    endNode = lastTextNode;
    endNodeOffset = lastTextNode.textContent?.length || 0;
  }

  if (startNode && endNode) {
    try {
      const range = document.createRange();
      range.setStart(startNode, Math.min(startNodeOffset, startNode.textContent?.length || 0));
      range.setEnd(endNode, Math.min(endNodeOffset, endNode.textContent?.length || 0));

      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
      return true;
    } catch (e) {
      console.warn('Failed to set range from offsets:', e);
    }
  }
  return false;
}

export function cleanInlineColorStyles(
  node: HTMLElement | DocumentFragment,
  options: { clearColor?: boolean; clearGradient?: boolean } = { clearColor: true, clearGradient: true }
) {
  if (!node) return;
  const elements = Array.from(node.querySelectorAll('span, font'));
  if (node instanceof HTMLElement && (node.tagName === 'SPAN' || node.tagName === 'FONT')) {
    elements.unshift(node);
  }

  elements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    if (options.clearColor) {
      htmlEl.style.color = '';
      htmlEl.style.removeProperty('color');
    }
    if (options.clearGradient) {
      htmlEl.style.backgroundImage = '';
      htmlEl.style.webkitBackgroundClip = '';
      htmlEl.style.webkitTextFillColor = '';
      htmlEl.style.removeProperty('background-image');
      htmlEl.style.removeProperty('-webkit-background-clip');
      htmlEl.style.removeProperty('-webkit-text-fill-color');
      htmlEl.style.removeProperty('background-clip');
    }

    const styleAttr = htmlEl.getAttribute('style');
    if (styleAttr !== null && styleAttr.trim() === '') {
      htmlEl.removeAttribute('style');
    }
  });
}
