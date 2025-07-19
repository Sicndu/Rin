/**
 * 处理favicon上传的响应
 * 可以在favicon上传完成后调用
 */
export function handleFaviconUploadResponse(response: { url: string; timestamp: string }): void {
  // 分发自定义事件以通知Favicon组件更新
  window.dispatchEvent(
    new CustomEvent('favicon:updated', {
      detail: { url: response.url }
    })
  );

  // 保存到localStorage以便在页面刷新时保持
  localStorage.setItem('faviconUrl', response.url);

  // 如果需要，还可以清除其他可能存在的缓存
  // 例如，如果使用了service worker:
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CLEAR_FAVICON_CACHE',
      url: response.url.split('?')[0] // 获取不带查询参数的基本URL
    });
  }
}

/**
 * 强制刷新favicon
 * 在需要强制刷新favicon的地方调用，比如在用户主动点击刷新按钮时
 */
export function forceRefreshFavicon(): void {
  const timestamp = Date.now().toString();
  const currentFaviconUrl = localStorage.getItem('faviconUrl') || '/favicon';

  // 分离基本URL和查询参数
  const [baseUrl] = currentFaviconUrl.split('?');
  const newUrl = `${baseUrl}?v=${timestamp}`;

  // 更新favicon
  window.dispatchEvent(
    new CustomEvent('favicon:updated', {
      detail: { url: newUrl }
    })
  );

  localStorage.setItem('faviconUrl', newUrl);
}
