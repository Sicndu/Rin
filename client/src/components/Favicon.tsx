import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

interface FaviconProps {
  defaultPath?: string;
}

/**
 * Favicon组件 - 动态管理网站图标
 * 使用方式: <Favicon /> 放在应用根组件中
 */
export const Favicon: React.FC<FaviconProps> = ({ defaultPath = '/favicon' }) => {
  const [faviconUrl, setFaviconUrl] = useState<string>(defaultPath);

  useEffect(() => {
    // 尝试从localStorage获取已保存的带时间戳的favicon URL
    const savedFaviconUrl = localStorage.getItem('faviconUrl');
    if (savedFaviconUrl) {
      setFaviconUrl(savedFaviconUrl);
    }

    // 订阅自定义事件以接收新上传的favicon URL
    const handleFaviconUpdate = (event: CustomEvent) => {
      const { url } = event.detail;
      if (url) {
        setFaviconUrl(url);
        localStorage.setItem('faviconUrl', url);
      }
    };

    window.addEventListener('favicon:updated' as any, handleFaviconUpdate);

    return () => {
      window.removeEventListener('favicon:updated' as any, handleFaviconUpdate);
    };
  }, []);

  return (
    <Helmet>
      <link rel="icon" type="image/webp" href={faviconUrl} />
    </Helmet>
  );
};

/**
 * 当上传新favicon后，调用此函数以通知组件更新
 */
export function notifyFaviconUpdated(url: string): void {
  window.dispatchEvent(new CustomEvent('favicon:updated', { detail: { url } }));
}
