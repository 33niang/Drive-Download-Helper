// == 用户配置区域开始 ==

// 版本号 (会显示在页面页脚)
const SCRIPT_VERSION = 'v1.0.1';

// 允许代理的域名列表
const ALLOWED_HOSTS = [
  'drive.google.com',
  'www.dropbox.com',
  'drive.usercontent.google.com',
  'accounts.google.com',
  'dl.dropboxusercontent.com', // 允许所有 Dropbox 的下载子域名
];

// == 用户配置区域结束 ==


const ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><path d="M4 14a1 1 0 0 1-.78-1.63l2.66-3.32 2.54-3.18A.5.5 0 0 1 9 5.5h6.5a.5.5 0 0 1 .3.9L11 12v4c0 .55-.45 1-1 1H4z"/><path d="m18.5 12.5-5 5c-.22.22-.58.22-.8 0l-1.95-1.95c-.22-.22-.22-.58 0-.8s.58-.22.8 0L12 15.45l4.7-4.7c.22-.22.58-.22.8 0s.22.58 0 .8z"/></svg>`;

const HOMEPAGE_HTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>文件直链加速服务</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,${encodeURIComponent(ICON_SVG)}">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
  <style>
    @keyframes gradient-animation {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    body {
      font-family: 'Inter', sans-serif;
      background-size: 200% 200% !important;
      animation: gradient-animation 15s ease infinite;
      transition: background-image 0.5s ease-in-out;
    }
    .light-mode {
      background: linear-gradient(-45deg, #e0c3fc, #8ec5fc, #f093fb, #f5576c);
    }
    .dark-mode {
      background: linear-gradient(-45deg, #0f2027, #203a43, #2c5364, #132730);
    }
    .glass-container {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }
    .dark-mode .glass-container {
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .glow-shadow {
      box-shadow: 0 0 15px rgba(128, 90, 213, 0.4), 0 0 30px rgba(128, 90, 213, 0.3), 0 0 45px rgba(128, 90, 213, 0.2);
    }
    .title-gradient {
      background-image: linear-gradient(to right, #6366f1, #a855f7, #ec4899);
    }
    .btn-gradient {
      background-image: linear-gradient(to right, #8b5cf6 0%, #ec4899 51%, #8b5cf6 100%);
      background-size: 200% auto;
      transition: 0.5s;
    }
    .btn-gradient:hover {
      background-position: right center;
    }
    .toast {
      opacity: 0;
      transition: opacity 0.3s, transform 0.3s;
      transform: translateY(20px);
    }
    .toast.show {
      opacity: 1;
      transform: translateY(0);
    }
  </style>
</head>
<body class="light-mode min-h-screen flex items-center justify-center p-4">
  <button id="theme-toggle" class="fixed top-4 right-4 p-2 rounded-full text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 glass-container">
    <svg id="theme-icon-light" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m8.66-15.66l-.7.7M4.04 19.96l-.7.7M21 12h-1M4 12H3m15.66 8.66l-.7-.7M4.04 4.04l-.7-.7M12 8a4 4 0 100 8 4 4 0 000-8z"></path></svg>
    <svg id="theme-icon-dark" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
  </button>
  <div class="w-full max-w-4xl p-8 md:p-12 space-y-8 rounded-2xl glass-container glow-shadow">
    <div class="text-center">
      <h1 class="text-5xl md:text-7xl font-black text-transparent bg-clip-text title-gradient mb-4">极速文件链接</h1>
      <p class="text-lg text-gray-800 dark:text-gray-300">粘贴 Google Drive 或 Dropbox 分享链接，生成永不泄露的代理下载地址。</p>
    </div>
    <div class="flex flex-col sm:flex-row gap-4">
      <input id="source-url" type="text" placeholder="请在此处粘贴分享链接..." class="flex-grow p-4 border-2 border-transparent rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-500/50 bg-white/50 dark:bg-black/20 text-gray-900 dark:text-white transition-all">
      <button onclick="generateLink()" class="btn-gradient text-white font-bold px-8 py-4 rounded-lg uppercase tracking-wider transform hover:scale-105">生成链接</button>
    </div>
    <div id="result-area" class="hidden pt-6">
      <p id="result-text" class="p-4 rounded-lg bg-white/50 dark:bg-black/20 text-gray-900 dark:text-white break-all"></p>
      <div id="action-buttons" class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <button onclick="copyLink()" class="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold px-4 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">📋 复制链接</button>
        <a id="download-btn" href="#" target="_blank" class="w-full text-center btn-gradient text-white font-bold py-3 rounded-lg uppercase tracking-wider transform hover:scale-105">⚡ 立即下载</a>
      </div>
    </div>
  </div>
  <div id="toast" class="toast fixed bottom-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold"></div>
  <script>
    const workerDomain = window.location.origin;
    const urlInput = document.getElementById('source-url');
    const resultArea = document.getElementById('result-area');
    const resultText = document.getElementById('result-text');
    const downloadBtn = document.getElementById('download-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const lightIcon = document.getElementById('theme-icon-light');
    const darkIcon = document.getElementById('theme-icon-dark');
    let generatedLink = '';
    
    function setTheme(isDark) {
      document.body.classList.toggle('dark-mode', isDark);
      document.body.classList.toggle('light-mode', !isDark);
      lightIcon.classList.toggle('hidden', isDark);
      darkIcon.classList.toggle('hidden', !isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    themeToggle.addEventListener('click', () => {
        setTheme(document.body.classList.contains('light-mode'));
    });

    if (localStorage.getItem('theme') === 'dark' || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme'))) {
        setTheme(true);
    } else {
        setTheme(false);
    }

    function showToast(message, isError = false) { 
      const toast = document.getElementById('toast'); 
      toast.textContent = message; 
      toast.style.backgroundColor = isError ? 'rgb(239 68 68)' : 'rgb(34 197 94)';
      toast.classList.add('show'); 
      setTimeout(() => toast.classList.remove('show'), 3000); 
    }
    function generateLink() { 
      const sourceUrl = urlInput.value.trim(); 
      if (!sourceUrl) { showToast('请输入链接', true); return; } 
      try { new URL(sourceUrl); } catch (e) { showToast('请输入有效的链接', true); return; } 
      generatedLink = workerDomain + '/' + sourceUrl; 
      resultText.textContent = generatedLink; 
      downloadBtn.href = generatedLink; 
      resultArea.classList.remove('hidden'); 
    }
    function copyLink() { 
      if (!generatedLink) return; 
      navigator.clipboard.writeText(generatedLink).then(() => { showToast('链接已复制到剪贴板'); }).catch(err => { showToast('复制失败', true); }); 
    }
    urlInput.addEventListener('keyup', (event) => { if (event.key === 'Enter') generateLink(); });
  </script>
</body>
</html>
`;

/**
 * Google Drive 处理器 (v15.0 - 强制代理)
 * 此函数采用统一的手动重定向逻辑，确保所有流量都经过 Worker，防止代理“泄露”。
 * @param {URL} targetUrl 目标URL
 * @param {Request} request 原始请求
 * @param {string} workerOrigin worker域名
 * @returns {Promise<Response>}
 */
async function handleGoogleDrive(targetUrl, request, workerOrigin) {
  const upstreamHeaders = new Headers(request.headers);
  upstreamHeaders.set('Host', targetUrl.hostname);
  // 关键：对所有发往 Google 的请求都伪造 Referer，以通过防盗链检查。
  upstreamHeaders.set('Referer', 'https://drive.google.com/');

  // 核心原则：始终手动处理重定向，捕获所有跳转指令。
  const response = await fetch(targetUrl.toString(), {
    method: request.method,
    headers: upstreamHeaders,
    redirect: 'manual', // 强制手动模式，绝不自动跟随。
    body: request.body
  });

  const responseHeaders = new Headers(response.headers);

  // 关键步骤：检查是否收到了跳转指令 (3xx 状态码 + Location 头)。
  if (response.status >= 300 && response.status < 400 && responseHeaders.has('Location')) {
    const location = responseHeaders.get('Location');
    // 将 Google 的跳转地址构造成一个完整的 URL。
    const newLocationUrl = new URL(location, targetUrl.toString());
    // 将这个 URL 改写，让浏览器向我们的 Worker 发起下一次请求。
    const newLocation = `${workerOrigin}/${newLocationUrl.toString()}`;
    responseHeaders.set('Location', newLocation);

    // 返回这个被我们修改过的跳转响应给浏览器。
    return new Response(null, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  }

  // 如果收到的内容是 HTML (例如病毒警告页面)，则需要改写页面内部的所有链接。
  const contentType = responseHeaders.get('Content-Type') || '';
  if (contentType.includes('text/html')) {
    let body = await response.text();

    const rewriteUrl = (originalUrl) => `${workerOrigin}/${originalUrl}`;

    // 全面替换页面内的 action, src, href 属性中的绝对和相对链接。
    body = body.replace(/(action|src|href)="https?:\/\/([^"]+)"/g, (match, attr, url) => {
      const fullUrl = 'https://' + url;
      try {
        const hostname = new URL(fullUrl).hostname;
        const isAllowed = ALLOWED_HOSTS.some(allowedHost =>
          hostname === allowedHost || hostname.endsWith('.' + allowedHost)
        );
        if (isAllowed) {
          return `${attr}="${rewriteUrl(fullUrl)}"`;
        }
      } catch (e) { /* 无效URL，忽略 */ }
      return match;
    });
    body = body.replace(/(action|src|href)="\/([^"/][^"]*)"/g, (match, attr, path) => {
      return `${attr}="${rewriteUrl(targetUrl.origin + '/' + path)}"`;
    });

    // 删除 Google 的安全策略头，否则它会阻止我们的改写生效。
    responseHeaders.delete('Content-Security-Policy');

    return new Response(body, {
      status: response.status,
      headers: responseHeaders,
    });
  }

  // 如果既不是跳转，也不是 HTML (那就是最终的文件流)，则直接返回给用户。
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

/**
 * 通用代理处理器 (Dropbox 及其他)
 * @param {URL} targetUrl 目标URL
 * @param {Request} request 原始请求
 * @param {string} workerOrigin worker域名
 * @returns {Promise<Response>}
 */
async function simpleProxy(targetUrl, request, workerOrigin) {
  if (targetUrl.hostname === 'www.dropbox.com') {
    targetUrl.searchParams.set('dl', '1');
  }

  const response = await fetch(targetUrl.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: 'manual'
  });

  const responseHeaders = new Headers(response.headers);
  
  if (response.status >= 300 && response.status < 400 && responseHeaders.has('Location')) {
    const location = responseHeaders.get('Location');
    const newLocationUrl = new URL(location, targetUrl.toString());
    const newLocation = `${workerOrigin}/${newLocationUrl.toString()}`;
    responseHeaders.set('Location', newLocation);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const workerOrigin = url.origin;

    if (url.pathname === '/') {
      return new Response(HOMEPAGE_HTML, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    try {
      const decodedPath = decodeURIComponent(url.pathname);
      const targetUrlStr = (decodedPath.substring(1) + url.search).trim();
      
      let targetUrl;
      try {
        targetUrl = new URL(targetUrlStr.startsWith('http') ? targetUrlStr : 'https://' + targetUrlStr);
      } catch (e) {
        return new Response('无效的目标链接格式。', { status: 400 });
      }

      const isAllowed = ALLOWED_HOSTS.some(allowedHost =>
        targetUrl.hostname === allowedHost || targetUrl.hostname.endsWith('.' + allowedHost)
      );

      if (!isAllowed) {
        return new Response(`错误：域名 ${targetUrl.hostname} 不在允许列表中。`, { status: 403 });
      }

      // 路由判断
      if (targetUrl.hostname.includes('google.com')) {
        return await handleGoogleDrive(targetUrl, request, workerOrigin);
      } else {
        return await simpleProxy(targetUrl, request, workerOrigin);
      }

    } catch (error) {
      console.error('Fetch error:', error);
      return new Response(`处理请求时发生错误: ${error.message}`, { status: 502 });
    }
  },
};
