// ============ Public Documentation Page ============

/**
 * Generate documentation page HTML (no authentication required)
 */
export function getDocsHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AnyRouter - Universal API Proxy Service Documentation</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
    .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .glass-effect { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); }
    .code-block { background: #1e1e1e; border-radius: 8px; overflow-x: auto; }
    .code-block pre { margin: 0; padding: 16px; }
    .copy-btn { position: absolute; top: 8px; right: 8px; opacity: 0; transition: opacity 0.2s; }
    .code-block:hover .copy-btn { opacity: 1; }
    .toc-link { transition: all 0.2s; }
    .toc-link:hover { color: #667eea; transform: translateX(4px); }
    .toc-link.active { color: #667eea; font-weight: 600; border-left: 3px solid #667eea; padding-left: 12px; margin-left: -15px; }
    .section { scroll-margin-top: 80px; }
    html { scroll-behavior: smooth; }
    .api-card { transition: all 0.2s; }
    .api-card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
    /* TOC collapse/expand animation */
    .toc-sidebar { transition: width 0.3s ease, opacity 0.3s ease, padding 0.3s ease; overflow: hidden; }
    .toc-sidebar.collapsed { width: 48px !important; }
    .toc-sidebar.collapsed .toc-content { opacity: 0; pointer-events: none; }
    .toc-sidebar .toc-content { transition: opacity 0.2s ease; }
    .toc-toggle-btn { transition: transform 0.3s ease; }
    .toc-sidebar.collapsed .toc-toggle-btn { transform: rotate(180deg); }
  </style>
</head>
<body class="bg-gray-50 min-h-screen">
  <!-- Header -->
  <header class="gradient-bg text-white py-16 px-4">
    <div class="container mx-auto max-w-5xl">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold mb-4"><i class="fas fa-rocket mr-3"></i>AnyRouter</h1>
          <p class="text-xl text-purple-100 mb-2">Universal API Proxy Service</p>
          <p class="text-purple-200 mb-6">Supports unified forwarding of any HTTP API, including OpenAI, Anthropic, Google, Azure, Groq, and more.</p>
          <div class="flex gap-3 flex-wrap">
            <a href="https://github.com/dext7r/anyrouter" target="_blank" class="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all">
              <i class="fab fa-github mr-2"></i>GitHub
            </a>
            <a href="/admin" class="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all">
              <i class="fas fa-cog mr-2"></i>Admin Panel
            </a>
            <a href="/" class="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all">
              <i class="fas fa-home mr-2"></i>Home
            </a>
          </div>
        </div>
        <div class="hidden md:block text-right">
          <div class="text-6xl opacity-20"><i class="fas fa-cloud"></i></div>
        </div>
      </div>
    </div>
  </header>

  <div class="container mx-auto max-w-5xl px-4 py-8">
    <div class="flex gap-8">
      <!-- Sidebar TOC -->
      <aside id="tocSidebar" class="hidden lg:block w-56 shrink-0 toc-sidebar">
        <nav class="sticky top-8 glass-effect rounded-xl shadow-lg overflow-hidden">
          <div class="p-3 cursor-pointer hover:bg-purple-50 transition-all flex items-center justify-between" onclick="toggleTOC()">
            <h3 class="font-bold text-gray-800 toc-content whitespace-nowrap"><i class="fas fa-list mr-2 text-purple-600"></i>Table of Contents</h3>
            <i class="fas fa-chevron-left text-purple-600 toc-toggle-btn"></i>
          </div>
          <ul class="space-y-2 text-sm text-gray-600 px-4 pb-4 toc-content">
            <li><a href="#overview" class="toc-link block py-1">Overview</a></li>
            <li><a href="#supported-apis" class="toc-link block py-1">Supported APIs</a></li>
            <li><a href="#quick-start" class="toc-link block py-1">Quick Start</a></li>
            <li><a href="#auth-format" class="toc-link block py-1">Authentication Format</a></li>
            <li><a href="#usage-modes" class="toc-link block py-1">Usage Modes</a></li>
            <li><a href="#examples" class="toc-link block py-1">Code Examples</a></li>
            <li><a href="#sdk-config" class="toc-link block py-1">SDK Configuration</a></li>
            <li><a href="#errors" class="toc-link block py-1">Error Handling</a></li>
            <li><a href="#deployment" class="toc-link block py-1">Deployment Guide</a></li>
            <li><a href="#faq" class="toc-link block py-1">FAQ</a></li>
          </ul>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 min-w-0">
        <!-- Overview -->
        <section id="overview" class="section glass-effect rounded-xl p-6 shadow-lg mb-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4"><i class="fas fa-info-circle mr-2 text-purple-600"></i>Overview</h2>
          <p class="text-gray-600 mb-4">AnyRouter is a <strong>universal API proxy service</strong> running on Cloudflare Workers that can forward any HTTP API request:</p>
          <ul class="space-y-2 text-gray-600">
            <li class="flex items-start"><i class="fas fa-check text-green-500 mt-1 mr-2"></i><strong>Universal Proxy</strong>: Supports any HTTP/HTTPS API, not limited to AI services.</li>
            <li class="flex items-start"><i class="fas fa-check text-green-500 mt-1 mr-2"></i><strong>Key Management</strong>: Manage multiple API keys in one place and access them securely via short IDs.</li>
            <li class="flex items-start"><i class="fas fa-check text-green-500 mt-1 mr-2"></i><strong>Direct Passthrough</strong>: No pre-configuration needed. Use by passing the token directly.</li>
            <li class="flex items-start"><i class="fas fa-check text-green-500 mt-1 mr-2"></i><strong>Edge Acceleration</strong>: Low-latency access powered by Cloudflare's global edge network.</li>
            <li class="flex items-start"><i class="fas fa-check text-green-500 mt-1 mr-2"></i><strong>Request Statistics</strong>: Track usage and get stats by API and key.</li>
          </ul>
        </section>

        <!-- Supported APIs -->
        <section id="supported-apis" class="section glass-effect rounded-xl p-6 shadow-lg mb-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4"><i class="fas fa-plug mr-2 text-purple-600"></i>Supported APIs</h2>
          <p class="text-gray-600 mb-4">AnyRouter supports any HTTP API. Here are some examples of popular AI services:</p>

          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <div class="api-card bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
              <div class="flex items-center gap-2 mb-1">
                <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <i class="fas fa-brain text-white text-sm"></i>
                </div>
                <span class="font-semibold text-green-800 text-sm">OpenAI</span>
              </div>
              <code class="text-xs text-green-600 break-all">api.openai.com</code>
            </div>

            <div class="api-card bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-3 border border-orange-200">
              <div class="flex items-center gap-2 mb-1">
                <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <i class="fas fa-robot text-white text-sm"></i>
                </div>
                <span class="font-semibold text-orange-800 text-sm">Anthropic</span>
              </div>
              <code class="text-xs text-orange-600 break-all">api.anthropic.com</code>
            </div>

            <div class="api-card bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
              <div class="flex items-center gap-2 mb-1">
                <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <i class="fab fa-google text-white text-sm"></i>
                </div>
                <span class="font-semibold text-blue-800 text-sm">Google AI</span>
              </div>
              <code class="text-xs text-blue-600 break-all">generativelanguage.googleapis.com</code>
            </div>

            <div class="api-card bg-gradient-to-br from-cyan-50 to-sky-50 rounded-lg p-3 border border-cyan-200">
              <div class="flex items-center gap-2 mb-1">
                <div class="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                  <i class="fab fa-microsoft text-white text-sm"></i>
                </div>
                <span class="font-semibold text-cyan-800 text-sm">Azure OpenAI</span>
              </div>
              <code class="text-xs text-cyan-600 break-all">xxx.openai.azure.com</code>
            </div>

            <div class="api-card bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-3 border border-purple-200">
              <div class="flex items-center gap-2 mb-1">
                <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <i class="fas fa-bolt text-white text-sm"></i>
                </div>
                <span class="font-semibold text-purple-800 text-sm">Groq</span>
              </div>
              <code class="text-xs text-purple-600 break-all">api.groq.com</code>
            </div>

            <div class="api-card bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg p-3 border border-pink-200">
              <div class="flex items-center gap-2 mb-1">
                <div class="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                  <i class="fas fa-fire text-white text-sm"></i>
                </div>
                <span class="font-semibold text-pink-800 text-sm">Mistral</span>
              </div>
              <code class="text-xs text-pink-600 break-all">api.mistral.ai</code>
            </div>

            <div class="api-card bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-3 border border-yellow-200">
              <div class="flex items-center gap-2 mb-1">
                <div class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <i class="fas fa-sun text-white text-sm"></i>
                </div>
                <span class="font-semibold text-yellow-800 text-sm">Cohere</span>
              </div>
              <code class="text-xs text-yellow-600 break-all">api.cohere.ai</code>
            </div>

            <div class="api-card bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-3 border border-gray-200">
              <div class="flex items-center gap-2 mb-1">
                <div class="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                  <i class="fas fa-ellipsis-h text-white text-sm"></i>
                </div>
                <span class="font-semibold text-gray-800 text-sm">And more...</span>
              </div>
              <code class="text-xs text-gray-600">Any HTTP API</code>
            </div>
          </div>

          <div class="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-blue-700"><i class="fas fa-info-circle mr-1"></i>Any standard HTTP/HTTPS API can be proxied through AnyRouter, not just the services listed above.</p>
          </div>
        </section>

        <!-- Quick Start -->
        <section id="quick-start" class="section glass-effect rounded-xl p-6 shadow-lg mb-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4"><i class="fas fa-bolt mr-2 text-purple-600"></i>Quick Start</h2>
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">1. Get Your Proxy Address</h3>
              <p class="text-gray-600 mb-2">Your current service address:</p>
              <div class="code-block relative">
                <pre><code class="language-text" id="proxyUrl"></code></pre>
                <button onclick="copyToClipboard('proxyUrl')" class="copy-btn px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">2. Set Authentication Info</h3>
              <p class="text-gray-600">Add an <code class="bg-gray-100 px-2 py-1 rounded text-purple-600">Authorization</code> header to your request with the following format:</p>
            </div>
          </div>
        </section>

        <!-- Auth Format -->
        <section id="auth-format" class="section glass-effect rounded-xl p-6 shadow-lg mb-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4"><i class="fas fa-key mr-2 text-purple-600"></i>Authentication Format</h2>
          <div class="code-block relative mb-4">
            <pre><code class="language-http">Authorization: Bearer &lt;Target API URL&gt;:&lt;Key ID or Token&gt;</code></pre>
          </div>
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <h4 class="font-semibold text-yellow-800 mb-2"><i class="fas fa-lightbulb mr-1"></i>Format Details</h4>
            <ul class="text-sm text-yellow-700 space-y-1">
              <li>• <strong>Target API URL</strong>: The full URL of the target API, e.g., <code>https://api.openai.com</code></li>
              <li>• <strong>Key ID</strong>: A 6-digit alphanumeric ID used to look up the corresponding token from the database.</li>
              <li>• <strong>Token</strong>: The full API token passed directly (Direct Passthrough mode).</li>
            </ul>
          </div>

          <h3 class="font-semibold text-gray-800 mb-2">Platform Examples</h3>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <span class="w-20 text-gray-500">OpenAI:</span>
              <code class="text-green-600">Bearer https://api.openai.com:a3x9k2</code>
            </div>
            <div class="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <span class="w-20 text-gray-500">Anthropic:</span>
              <code class="text-orange-600">Bearer https://api.anthropic.com:b4y8m1</code>
            </div>
            <div class="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <span class="w-20 text-gray-500">Google AI:</span>
              <code class="text-blue-600">Bearer https://generativelanguage.googleapis.com:c5z2n3</code>
            </div>
            <div class="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <span class="w-20 text-gray-500">Groq:</span>
              <code class="text-purple-600">Bearer https://api.groq.com:d6w4p5</code>
            </div>
          </div>
        </section>

        <!-- Usage Modes -->
        <section id="usage-modes" class="section glass-effect rounded-xl p-6 shadow-lg mb-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4"><i class="fas fa-exchange-alt mr-2 text-purple-600"></i>Usage Modes</h2>

          <div class="grid md:grid-cols-3 gap-4">
            <!-- SK Alias Mode -->
            <div class="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border-2 border-orange-300">
              <div class="flex items-center mb-3">
                <span class="px-2 py-1 bg-orange-500 text-white text-xs rounded-full font-bold mr-2">Best</span>
                <h3 class="font-bold text-orange-800">SK Alias Mode</h3>
              </div>
              <p class="text-sm text-orange-700 mb-3">Use an OpenAI-style SK alias for one-click access.</p>
              <div class="code-block">
                <pre><code class="language-text">Bearer sk-ar-xxxxxxxx...</code></pre>
              </div>
              <ul class="mt-3 text-xs text-orange-600 space-y-1">
                <li><i class="fas fa-star mr-1"></i>Native API key format</li>
                <li><i class="fas fa-shield-alt mr-1"></i>Doesn't expose real token</li>
                <li><i class="fas fa-magic mr-1"></i>Auto-detects target API</li>
                <li><i class="fas fa-sync mr-1"></i>Can be regenerated anytime</li>
              </ul>
            </div>

            <!-- Key ID Mode -->
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <div class="flex items-center mb-3">
                <span class="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-bold mr-2">Recommended</span>
                <h3 class="font-bold text-blue-800">Key ID Mode</h3>
              </div>
              <p class="text-sm text-blue-700 mb-3">Use a 6-digit short ID + URL to access a pre-configured key.</p>
              <div class="code-block">
                <pre><code class="language-text">Bearer https://api.openai.com:a3x9k2</code></pre>
              </div>
              <ul class="mt-3 text-xs text-blue-600 space-y-1">
                <li><i class="fas fa-shield-alt mr-1"></i>Doesn't expose real token</li>
                <li><i class="fas fa-tachometer-alt mr-1"></i>Supports usage statistics</li>
                <li><i class="fas fa-toggle-on mr-1"></i>Can be enabled/disabled</li>
              </ul>
            </div>

            <!-- Direct Mode -->
            <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div class="flex items-center mb-3">
                <span class="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-bold mr-2">Flexible</span>
                <h3 class="font-bold text-green-800">Direct Passthrough Mode</h3>
              </div>
              <p class="text-sm text-green-700 mb-3">Pass the API token directly in the request.</p>
              <div class="code-block">
                <pre><code class="language-text">Bearer https://api.openai.com:sk-xxx...</code></pre>
              </div>
              <ul class="mt-3 text-xs text-green-600 space-y-1">
                <li><i class="fas fa-bolt mr-1"></i>No config needed</li>
                <li><i class="fas fa-globe mr-1"></i>Supports any API URL</li>
                <li><i class="fas fa-clock mr-1"></i>Ideal for temporary use</li>
              </ul>
            </div>
          </div>

          <div class="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 class="font-semibold text-purple-800 mb-2"><i class="fas fa-magic mr-1"></i>Automatic Mode Detection</h4>
            <p class="text-sm text-purple-700">The system automatically determines the mode based on the Authorization header:</p>
            <ul class="text-sm text-purple-600 mt-2 space-y-1">
              <li>• Starts with <code>sk-ar-xxx</code> → SK Alias Mode (auto-matches target API)</li>
              <li>• URL followed by 6 alphanumeric chars (e.g., <code>https://...:a3x9k2</code>) → Key ID Mode</li>
              <li>• URL followed by other formats (e.g., <code>https://...:sk-xxx</code>) → Direct Passthrough Mode</li>
            </ul>
          </div>

          <!-- SK Alias Details -->
          <div class="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 class="font-semibold text-orange-800 mb-2"><i class="fas fa-key mr-1"></i>SK Alias Explained</h4>
            <p class="text-sm text-orange-700 mb-3">The SK Alias is a unique AnyRouter authentication method, formatted like a native API key:</p>
            <div class="grid md:grid-cols-2 gap-3 text-sm">
              <div class="bg-white rounded p-3">
                <div class="font-medium text-gray-700 mb-1">Format Comparison</div>
                <ul class="text-xs text-gray-600 space-y-1">
                  <li>OpenAI: <code class="text-green-600">sk-proj-xxx</code></li>
                  <li>Anthropic: <code class="text-orange-600">sk-ant-xxx</code></li>
                  <li>AnyRouter: <code class="text-purple-600">sk-ar-xxx</code></li>
                </ul>
              </div>
              <div class="bg-white rounded p-3">
                <div class="font-medium text-gray-700 mb-1">How to Use</div>
                <ol class="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Click "Generate" in the admin panel to get an SK alias.</li>
                  <li>Use the <code>sk-ar-xxx</code> alias as your API key.</li>
                  <li>No need to specify the target API URL.</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <!-- Code Examples -->
        <section id="examples" class="section glass-effect rounded-xl p-6 shadow-lg mb-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4"><i class="fas fa-code mr-2 text-purple-600"></i>Code Examples</h2>

          <!-- cURL -->
          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 mb-2"><i class="fas fa-terminal mr-2 text-gray-500"></i>cURL - OpenAI</h3>
            <div class="code-block relative">
              <pre><code class="language-bash" id="curl-openai">curl -X POST '<span class="proxy-url"></span>/v1/chat/completions' \\
  -H 'Authorization: Bearer https://api.openai.com:a3x9k2' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'</code></pre>
              <button onclick="copyCode('curl-openai')" class="copy-btn px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>

          <!-- cURL Anthropic -->
          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 mb-2"><i class="fas fa-terminal mr-2 text-gray-500"></i>cURL - Anthropic</h3>
            <div class="code-block relative">
              <pre><code class="language-bash" id="curl-anthropic">curl -X POST '<span class="proxy-url"></span>/v1/messages' \\
  -H 'Authorization: Bearer https://api.anthropic.com:b4y8m1' \\
  -H 'Content-Type: application/json' \\
  -H 'anthropic-version: 2023-06-01' \\
  -d '{
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'</code></pre>
              <button onclick="copyCode('curl-anthropic')" class="copy-btn px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>

          <!-- cURL Google -->
          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 mb-2"><i class="fas fa-terminal mr-2 text-gray-500"></i>cURL - Google AI (Gemini)</h3>
            <div class="code-block relative">
              <pre><code class="language-bash" id="curl-google">curl -X POST '<span class="proxy-url"></span>/v1beta/models/gemini-pro:generateContent' \\
  -H 'Authorization: Bearer https://generativelanguage.googleapis.com:c5z2n3' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "contents": [{"parts": [{"text": "Hello!"}]}]
  }'</code></pre>
              <button onclick="copyCode('curl-google')" class="copy-btn px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>

          <!-- Python OpenAI -->
          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 mb-2"><i class="fab fa-python mr-2 text-blue-500"></i>Python - OpenAI SDK</h3>
            <div class="code-block relative">
              <pre><code class="language-python" id="python-openai">from openai import OpenAI

client = OpenAI(
    base_url='<span class="proxy-url"></span>/v1',
    api_key='https://api.openai.com:a3x9k2'
)

response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)</code></pre>
              <button onclick="copyCode('python-openai')" class="copy-btn px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>

          <!-- Python Anthropic -->
          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 mb-2"><i class="fab fa-python mr-2 text-blue-500"></i>Python - Anthropic SDK</h3>
            <div class="code-block relative">
              <pre><code class="language-python" id="python-anthropic">import anthropic

client = anthropic.Anthropic(
    base_url='<span class="proxy-url"></span>',
    api_key='https://api.anthropic.com:b4y8m1'
)

message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
print(message.content[0].text)</code></pre>
              <button onclick="copyCode('python-anthropic')" class="copy-btn px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>

          <!-- Python Groq -->
          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 mb-2"><i class="fab fa-python mr-2 text-blue-500"></i>Python - Groq SDK</h3>
            <div class="code-block relative">
              <pre><code class="language-python" id="python-groq">from groq import Groq

client = Groq(
    base_url='<span class="proxy-url"></span>/openai/v1',
    api_key='https://api.groq.com:d6w4p5'
)

response = client.chat.completions.create(
    model="llama-3.1-70b-versatile",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)</code></pre>
              <button onclick="copyCode('python-groq')" class="copy-btn px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>

          <!-- JavaScript -->
          <div>
            <h3 class="font-semibold text-gray-800 mb-2"><i class="fab fa-js mr-2 text-yellow-500"></i>JavaScript - fetch</h3>
            <div class="code-block relative">
              <pre><code class="language-javascript" id="js-example">const response = await fetch('<span class="proxy-url"></span>/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer https://api.openai.com:a3x9k2',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [{ role: 'user', content: 'Hello!' }]
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);</code></pre>
              <button onclick="copyCode('js-example')" class="copy-btn px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>
        </section>

        <!-- SDK Config -->
        <section id="sdk-config" class="section glass-effect rounded-xl p-6 shadow-lg mb-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4"><i class="fas fa-cogs mr-2 text-purple-600"></i>SDK / CLI Configuration</h2>
          <p class="text-gray-600 mb-4">Configure various SDKs and CLI tools to use this proxy service via environment variables:</p>

          <!-- SK Alias Mode (Recommended) -->
          <div class="mb-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded-lg">
            <h3 class="font-semibold text-orange-800 mb-2"><i class="fas fa-star mr-2 text-orange-500"></i>SK Alias Mode (Recommended)</h3>
            <p class="text-sm text-orange-700 mb-3">Using an SK alias is the simplest method and doesn't require specifying the target API URL:</p>
            <div class="code-block relative mb-2">
              <pre><code class="language-bash" id="config-sk-alias"># Claude Code / Anthropic SDK
export ANTHROPIC_BASE_URL=<span class="proxy-url"></span>
export ANTHROPIC_AUTH_TOKEN=sk-ar-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# OpenAI SDK
export OPENAI_BASE_URL=<span class="proxy-url"></span>/v1
export OPENAI_API_KEY=sk-ar-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code></pre>
              <button onclick="copyCode('config-sk-alias')" class="copy-btn px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
                <i class="fas fa-copy"></i>
              </button>
            </div>
            <p class="text-xs text-orange-600"><i class="fas fa-info-circle mr-1"></i>Click the "Generate" button in the admin panel's config list to get your SK alias.</p>
          </div>

          <!-- Claude Code -->
          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 mb-2"><i class="fas fa-terminal mr-2 text-orange-500"></i>Claude Code CLI (Key ID Mode)</h3>
            <div class="code-block relative mb-2">
              <pre><code class="language-bash" id="config-claude">export ANTHROPIC_BASE_URL=<span class="proxy-url"></span>
export ANTHROPIC_AUTH_TOKEN=https://api.anthropic.com:b4y8m1</code></pre>
              <button onclick="copyCode('config-claude')" class="copy-btn px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>

          <!-- OpenAI CLI -->
          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 mb-2"><i class="fas fa-terminal mr-2 text-green-500"></i>OpenAI CLI / SDK (Key ID Mode)</h3>
            <div class="code-block relative mb-2">
              <pre><code class="language-bash" id="config-openai">export OPENAI_BASE_URL=<span class="proxy-url"></span>/v1
export OPENAI_API_KEY=https://api.openai.com:a3x9k2</code></pre>
              <button onclick="copyCode('config-openai')" class="copy-btn px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>

          <!-- Generic -->
          <div class="mb-4">
            <h3 class="font-semibold text-gray-800 mb-2"><i class="fas fa-terminal mr-2 text-purple-500"></i>Generic Configuration Mode</h3>
            <div class="code-block relative mb-2">
              <pre><code class="language-bash" id="config-generic"># SK Alias Mode (simplest)
export {SDK}_BASE_URL=<span class="proxy-url"></span>
export {SDK}_API_KEY=sk-ar-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Key ID Mode
export {SDK}_BASE_URL=<span class="proxy-url"></span>
export {SDK}_API_KEY=https://{TargetAPIDomain}:{KeyID}</code></pre>
              <button onclick="copyCode('config-generic')" class="copy-btn px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="font-semibold text-blue-800 mb-2"><i class="fas fa-info-circle mr-1"></i>Configuration Notes</h4>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• <strong>SK Alias Mode</strong>: The simplest. Just one <code>sk-ar-xxx</code> key is needed, and the system auto-detects the target API.</li>
              <li>• <strong>Key ID Mode</strong>: Requires specifying the URL and 6-digit Key ID. Best when you need to explicitly target a service.</li>
              <li>• Environment variables can be added to your <code>~/.bashrc</code>, <code>~/.zshrc</code>, or a project <code>.env</code> file.</li>
            </ul>
          </div>
        </section>

        <!-- Errors -->
        <section id="errors" class="section glass-effect rounded-xl p-6 shadow-lg mb-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4"><i class="fas fa-exclamation-triangle mr-2 text-purple-600"></i>Error Handling</h2>
          <p class="text-gray-600 mb-4">If a request fails, the API returns a structured error message:</p>

          <div class="code-block mb-4">
            <pre><code class="language-json">{
  "error": {
    "code": "NOT_FOUND",
    "message": "Key ID not found",
    "hint": "Could not find Key ID \\"abc123\\". Please check if it's correct.",
    "contact": "Contact the administrator if you have questions."
  }
}</code></pre>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-2 px-3 font-semibold text-gray-700">Error Code</th>
                  <th class="text-left py-2 px-3 font-semibold text-gray-700">HTTP Status</th>
                  <th class="text-left py-2 px-3 font-semibold text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody class="text-gray-600">
                <tr class="border-b border-gray-100">
                  <td class="py-2 px-3"><code class="text-red-600">UNAUTHORIZED</code></td>
                  <td class="py-2 px-3">401</td>
                  <td class="py-2 px-3">Missing or invalid Authorization header.</td>
                </tr>
                <tr class="border-b border-gray-100">
                  <td class="py-2 px-3"><code class="text-red-600">BAD_REQUEST</code></td>
                  <td class="py-2 px-3">400</td>
                  <td class="py-2 px-3">Invalid request format.</td>
                </tr>
                <tr class="border-b border-gray-100">
                  <td class="py-2 px-3"><code class="text-red-600">NOT_FOUND</code></td>
                  <td class="py-2 px-3">404</td>
                  <td class="py-2 px-3">API URL not configured or Key ID not found.</td>
                </tr>
                <tr class="border-b border-gray-100">
                  <td class="py-2 px-3"><code class="text-red-600">FORBIDDEN</code></td>
                  <td class="py-2 px-3">403</td>
                  <td class="py-2 px-3">Key is disabled.</td>
                </tr>
                <tr>
                  <td class="py-2 px-3"><code class="text-red-600">SERVICE_ERROR</code></td>
                  <td class="py-2 px-3">503</td>
                  <td class="py-2 px-3">Failed to connect to the target API.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Deployment Guide -->
        <section id="deployment" class="section glass-effect rounded-xl p-6 shadow-lg mb-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4"><i class="fas fa-server mr-2 text-purple-600"></i>Deployment Guide</h2>
          <p class="text-gray-600 mb-4">Choose one of the following methods to deploy your AnyRouter proxy service:</p>

          <!-- Deploy Methods Tabs -->
          <div class="mb-6">
            <div class="flex border-b border-gray-200 mb-4">
              <button onclick="showDeployTab('oneclick')" id="tab-oneclick" class="deploy-tab px-4 py-2 text-sm font-medium text-purple-600 border-b-2 border-purple-600">
                <i class="fas fa-bolt mr-1"></i>One-Click Deploy
              </button>
              <button onclick="showDeployTab('github')" id="tab-github" class="deploy-tab px-4 py-2 text-sm font-medium text-gray-500 hover:text-purple-600">
                <i class="fab fa-github mr-1"></i>Link GitHub Repo
              </button>
              <button onclick="showDeployTab('paste')" id="tab-paste" class="deploy-tab px-4 py-2 text-sm font-medium text-gray-500 hover:text-purple-600">
                <i class="fas fa-paste mr-1"></i>Copy & Paste
              </button>
              <button onclick="showDeployTab('cli')" id="tab-cli" class="deploy-tab px-4 py-2 text-sm font-medium text-gray-500 hover:text-purple-600">
                <i class="fas fa-terminal mr-1"></i>CLI Deploy
              </button>
              <button onclick="showDeployTab('actions')" id="tab-actions" class="deploy-tab px-4 py-2 text-sm font-medium text-gray-500 hover:text-purple-600">
                <i class="fas fa-cogs mr-1"></i>GitHub Actions
              </button>
            </div>

            <!-- One-Click Deploy -->
            <div id="deploy-oneclick" class="deploy-content">
              <div class="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4 mb-4">
                <h4 class="font-semibold text-orange-800 mb-2"><i class="fas fa-star mr-1"></i>Easiest Method</h4>
                <p class="text-sm text-orange-700 mb-3">Click the button below to automatically fork and deploy to your Cloudflare account:</p>
                <a href="https://deploy.workers.cloudflare.com/?url=https://github.com/dext7r/anyrouter" target="_blank" class="inline-block">
                  <img src="https://deploy.workers.cloudflare.com/button" alt="Deploy to Cloudflare Workers" class="h-10">
                </a>
              </div>
              <div class="text-sm text-gray-600">
                <p class="mb-2"><strong>Configure environment variables after deployment:</strong></p>
                <ol class="list-decimal list-inside space-y-1 text-gray-500">
                  <li>Go to Cloudflare Dashboard → Workers & Pages → Your Worker</li>
                  <li>Click Settings → Variables and Secrets</li>
                  <li>Add variables like <code class="bg-gray-100 px-1 rounded">ADMIN_PASSWORD</code>, <code class="bg-gray-100 px-1 rounded">SUPABASE_URL</code>, etc.</li>
                </ol>
              </div>
            </div>

            <!-- GitHub Integration -->
            <div id="deploy-github" class="deploy-content hidden">
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 class="font-semibold text-blue-800 mb-2"><i class="fab fa-github mr-1"></i>Auto-deploy by linking a GitHub repository</h4>
                <p class="text-sm text-blue-700">Cloudflare will automatically build and deploy whenever you push code to GitHub.</p>
              </div>
              <ol class="space-y-3 text-sm text-gray-600">
                <li class="flex items-start">
                  <span class="font-bold text-purple-600 mr-2">1.</span>
                  <div>Fork <a href="https://github.com/dext7r/anyrouter" target="_blank" class="text-purple-600 hover:underline">dext7r/anyrouter</a> to your GitHub account.</div>
                </li>
                <li class="flex items-start">
                  <span class="font-bold text-purple-600 mr-2">2.</span>
                  <div>Log in to <a href="https://dash.cloudflare.com" target="_blank" class="text-purple-600 hover:underline">Cloudflare Dashboard</a> → Workers & Pages → <strong>Create</strong>.</div>
                </li>
                <li class="flex items-start">
                  <span class="font-bold text-purple-600 mr-2">3.</span>
                  <div>Select <strong>Workers</strong> → <strong>Import from GitHub</strong>.</div>
                </li>
                <li class="flex items-start">
                  <span class="font-bold text-purple-600 mr-2">4.</span>
                  <div>Authorize GitHub and select your forked repository.</div>
                </li>
                <li class="flex items-start">
                  <span class="font-bold text-purple-600 mr-2">5.</span>
                  <div>Use the default settings and click <strong>Deploy</strong> (the repo already includes wrangler.toml).</div>
                </li>
                <li class="flex items-start">
                  <span class="font-bold text-purple-600 mr-2">6.</span>
                  <div>After deployment, go to Settings → Variables and Secrets to add environment variables.</div>
                </li>
              </ol>
            </div>

            <!-- Paste Deploy -->
            <div id="deploy-paste" class="deploy-content hidden">
              <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 class="font-semibold text-green-800 mb-2"><i class="fas fa-paste mr-1"></i>Deploy by copying code directly</h4>
                <p class="text-sm text-green-700">No Git needed. Just copy the bundled code into Cloudflare Workers.</p>
              </div>
              <ol class="space-y-3 text-sm text-gray-600">
                <li class="flex items-start">
                  <span class="font-bold text-purple-600 mr-2">1.</span>
                  <div>Log in to <a href="https://dash.cloudflare.com" target="_blank" class="text-purple-600 hover:underline">Cloudflare Dashboard</a> → Workers & Pages → <strong>Create</strong>.</div>
                </li>
                <li class="flex items-start">
                  <span class="font-bold text-purple-600 mr-2">2.</span>
                  <div>Select <strong>Workers</strong> → <strong>Create Worker</strong> (or use the Hello World template).</div>
                </li>
                <li class="flex items-start">
                  <span class="font-bold text-purple-600 mr-2">3.</span>
                  <div>Name your Worker (e.g., <code class="bg-gray-100 px-1 rounded">anyrouter</code>) and click <strong>Deploy</strong>.</div>
                </li>
                <li class="flex items-start">
                  <span class="font-bold text-purple-600 mr-2">4.</span>
                  <div>Click <strong>Edit code</strong> to open the online editor.</div>
                </li>
                <li class="flex items-start">
                  <span class="font-bold text-purple-600 mr-2">5.</span>
                  <div>
                    <strong>Delete</strong> the default code and click the button below to copy the code:
                    <div class="mt-2 flex items-center gap-2 flex-wrap">
                      <button onclick="copyWorkerCode()" id="copyWorkerBtn" class="text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow">
                        <i class="fas fa-copy mr-1"></i>One-click copy anyrouter.js
                      </button>
                      <a href="https://raw.githubusercontent.com/dext7r/anyrouter/main/anyrouter.js" target="_blank" class="text-xs text-purple-600 hover:underline"><i class="fas fa-external-link-alt mr-1"></i>Or open manually</a>
                    </div>
                    <p class="text-xs text-gray-400 mt-1" id="copyWorkerStatus"></p>
                  </div>
                </li>
                <li class="flex items-start">
                  <span class="font-bold text-purple-600 mr-2">6.</span>
                  <div>Click the <strong>Deploy</strong> button in the top right.</div>
                </li>
                <li class="flex items-start">
                  <span class="font-bold text-purple-600 mr-2">7.</span>
                  <div>Go back to the Worker settings to add environment variables (see below).</div>
                </li>
              </ol>
              <div class="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p class="text-sm text-yellow-700"><i class="fas fa-lightbulb mr-1"></i><strong>Tip</strong>: This method is great for a quick trial, but future updates require manually copying new code. We recommend linking a GitHub repo for automatic updates.</p>
              </div>
            </div>

            <!-- CLI Deploy -->
            <div id="deploy-cli" class="deploy-content hidden">
              <div class="code-block relative mb-4">
                <pre><code class="language-bash" id="deploy-clone"># Clone the repo
git clone https://github.com/dext7r/anyrouter.git
cd anyrouter
npm install

# Local development (optional)
cp wrangler.toml.example wrangler.toml.local
# Edit wrangler.toml.local to fill in your env vars
npx wrangler dev -c wrangler.toml.local

# Deploy to Cloudflare
npm run build
npx wrangler login  # Required for the first time
npx wrangler deploy
# Configure environment variables in the Dashboard after deployment</code></pre>
                <button onclick="copyCode('deploy-clone')" class="copy-btn px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>

            <!-- GitHub Actions -->
            <div id="deploy-actions" class="deploy-content hidden">
              <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 class="font-semibold text-green-800 mb-2"><i class="fas fa-robot mr-1"></i>Automated CI/CD</h4>
                <p class="text-sm text-green-700">Automatically deploy when you push to the main branch.</p>
              </div>
              <p class="text-sm text-gray-600 mb-3">Create <code class="bg-gray-100 px-1 rounded">.github/workflows/deploy.yml</code> in your repository:</p>
              <div class="code-block relative mb-4">
                <pre><code class="language-yaml" id="deploy-actions-code">name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - run: npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: \$\{{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: \$\{{ secrets.CLOUDFLARE_ACCOUNT_ID }}</code></pre>
                <button onclick="copyCode('deploy-actions-code')" class="copy-btn px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
              <div class="text-sm text-gray-600">
                <p class="mb-2"><strong>Configure GitHub Secrets:</strong></p>
                <ol class="list-decimal list-inside space-y-1 text-gray-500">
                  <li>Create a token in Cloudflare Dashboard → My Profile → API Tokens.</li>
                  <li>Permissions: Account - Cloudflare Workers Scripts - Edit.</li>
                  <li>In your GitHub repo, go to Settings → Secrets → Actions and add:
                    <ul class="list-disc list-inside ml-4 mt-1">
                      <li><code class="bg-gray-100 px-1 rounded">CLOUDFLARE_API_TOKEN</code></li>
                      <li><code class="bg-gray-100 px-1 rounded">CLOUDFLARE_ACCOUNT_ID</code></li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <!-- Prerequisites -->
          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
              <i class="fas fa-clipboard-list mr-2 text-purple-600"></i>Prerequisites
            </h3>
            <div class="bg-gray-50 rounded-lg p-4 text-sm">
              <ul class="space-y-2 text-gray-600">
                <li><i class="fas fa-check text-green-500 mr-2"></i>GitHub account (to fork the code repository)</li>
                <li><i class="fas fa-check text-green-500 mr-2"></i>Cloudflare account (<a href="https://dash.cloudflare.com/sign-up" target="_blank" class="text-purple-600 hover:underline">free to sign up</a>)</li>
                <li><i class="fas fa-check text-green-500 mr-2"></i>Supabase account (<a href="https://supabase.com" target="_blank" class="text-purple-600 hover:underline">free to sign up</a>, optional, for key management)</li>
                <li><i class="fas fa-check text-green-500 mr-2"></i>Upstash account (<a href="https://upstash.com" target="_blank" class="text-purple-600 hover:underline">free to sign up</a>, optional, for Redis cache and stats)</li>
              </ul>
            </div>
          </div>

          <!-- Step 3: Supabase Setup -->
          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
              <span class="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm mr-2">3</span>
              Configure Supabase Database (Optional)
            </h3>
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
              <p class="text-sm text-green-700"><i class="fas fa-info-circle mr-1"></i>You can skip this step if you only need the Direct Passthrough mode.</p>
            </div>
            <ol class="space-y-3 text-sm text-gray-600">
              <li class="flex items-start">
                <span class="font-bold text-purple-600 mr-2">a.</span>
                Log in to <a href="https://supabase.com" target="_blank" class="text-purple-600 hover:underline">Supabase</a> and create a new project.
              </li>
              <li class="flex items-start">
                <span class="font-bold text-purple-600 mr-2">b.</span>
                Go to the SQL Editor and run the database initialization script:
              </li>
            </ol>
            <div class="mt-3 border border-gray-200 rounded-lg overflow-hidden">
              <div class="flex items-center justify-between px-3 py-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all" onclick="toggleSchemaSQL()">
                <div class="flex items-center gap-2">
                  <i id="schemaSqlToggle" class="fas fa-chevron-right text-purple-600 text-xs transition-transform"></i>
                  <span class="text-xs text-gray-600 font-medium"><i class="fas fa-database mr-1"></i>schema.sql - Fetched live from GitHub</span>
                </div>
                <div class="flex gap-2" onclick="event.stopPropagation()">
                  <a href="https://github.com/dext7r/anyrouter/blob/main/schema.sql" target="_blank" class="text-xs text-purple-600 hover:underline"><i class="fab fa-github mr-1"></i>View Source</a>
                  <button onclick="loadSchemaSQL()" class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200"><i class="fas fa-sync-alt mr-1"></i>Refresh</button>
                  <button onclick="copyCode('deploy-sql')" class="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700"><i class="fas fa-copy mr-1"></i>Copy</button>
                </div>
              </div>
              <div id="schemaSqlContent" class="hidden">
                <div class="code-block relative rounded-none">
                  <pre style="max-height: 400px; overflow-y: auto;"><code class="language-sql" id="deploy-sql"><i class="fas fa-spinner fa-spin"></i> Loading schema.sql from GitHub...</code></pre>
                </div>
              </div>
              <p class="text-xs text-gray-500 px-3 py-2 bg-gray-50 border-t border-gray-200"><i class="fas fa-info-circle mr-1"></i>Script includes: table creation, indexes, RLS policies, triggers, and migration logic (supports upgrading existing tables).</p>
            </div>
            <ol class="space-y-3 text-sm text-gray-600 mt-3" start="3">
              <li class="flex items-start">
                <span class="font-bold text-purple-600 mr-2">c.</span>
                Go to Settings → API to get the <code class="bg-gray-100 px-1 rounded">Project URL</code> and <code class="bg-gray-100 px-1 rounded">anon/public key</code>.
              </li>
            </ol>
          </div>

          <!-- Step 4: Upstash Setup -->
          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
              <span class="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm mr-2">4</span>
              Configure Upstash Redis (Optional)
            </h3>
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
              <p class="text-sm text-green-700"><i class="fas fa-info-circle mr-1"></i>You can skip this step if you don't need statistics and caching features.</p>
            </div>
            <ol class="space-y-3 text-sm text-gray-600">
              <li class="flex items-start">
                <span class="font-bold text-purple-600 mr-2">a.</span>
                Log in to <a href="https://upstash.com" target="_blank" class="text-purple-600 hover:underline">Upstash</a> and create a Redis database.
              </li>
              <li class="flex items-start">
                <span class="font-bold text-purple-600 mr-2">b.</span>
                Choose the region closest to you (e.g., US-East-1 or AP-Northeast-1).
              </li>
              <li class="flex items-start">
                <span class="font-bold text-purple-600 mr-2">c.</span>
                From the REST API tab, copy the <code class="bg-gray-100 px-1 rounded">UPSTASH_REDIS_REST_URL</code> and <code class="bg-gray-100 px-1 rounded">UPSTASH_REDIS_REST_TOKEN</code>.
              </li>
            </ol>
          </div>

          <!-- Step 5: Environment Variables -->
          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
              <span class="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm mr-2">5</span>
              Configure Environment Variables
            </h3>
            <p class="text-sm text-gray-600 mb-3">After deploying, go to Cloudflare Dashboard → Workers → Your Worker → Settings → Variables and Secrets to add:</p>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="text-left py-2 px-3 font-semibold text-gray-700">Variable Name</th>
                    <th class="text-left py-2 px-3 font-semibold text-gray-700">Required</th>
                    <th class="text-left py-2 px-3 font-semibold text-gray-700">Description</th>
                    <th class="text-left py-2 px-3 font-semibold text-gray-700">How to Get</th>
                  </tr>
                </thead>
                <tbody class="text-gray-600">
                  <tr class="border-b border-gray-100">
                    <td class="py-2 px-3"><code class="text-purple-600">ADMIN_PASSWORD</code></td>
                    <td class="py-2 px-3"><span class="text-green-600 font-bold">✓</span></td>
                    <td class="py-2 px-3">Admin panel login password</td>
                    <td class="py-2 px-3 text-gray-400">Custom</td>
                  </tr>
                  <tr class="border-b border-gray-100">
                    <td class="py-2 px-3"><code class="text-purple-600">SUPABASE_URL</code></td>
                    <td class="py-2 px-3"><span class="text-gray-400">Optional</span></td>
                    <td class="py-2 px-3">Supabase project URL</td>
                    <td class="py-2 px-3 text-xs">Supabase → Settings → API → Project URL</td>
                  </tr>
                  <tr class="border-b border-gray-100">
                    <td class="py-2 px-3"><code class="text-purple-600">SUPABASE_KEY</code></td>
                    <td class="py-2 px-3"><span class="text-gray-400">Optional</span></td>
                    <td class="py-2 px-3">Supabase anon key</td>
                    <td class="py-2 px-3 text-xs">Supabase → Settings → API → anon public</td>
                  </tr>
                  <tr class="border-b border-gray-100">
                    <td class="py-2 px-3"><code class="text-purple-600">UPSTASH_REDIS_URL</code></td>
                    <td class="py-2 px-3"><span class="text-gray-400">Optional</span></td>
                    <td class="py-2 px-3">Upstash Redis REST URL</td>
                    <td class="py-2 px-3 text-xs">Upstash → Redis → REST API</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3"><code class="text-purple-600">UPSTASH_REDIS_TOKEN</code></td>
                    <td class="py-2 px-3"><span class="text-gray-400">Optional</span></td>
                    <td class="py-2 px-3">Upstash Redis Token</td>
                    <td class="py-2 px-3 text-xs">Upstash → Redis → REST API</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p class="text-sm text-blue-700"><i class="fas fa-info-circle mr-1"></i>You can still use Direct Passthrough mode without configuring Supabase/Redis.</p>
            </div>
          </div>

          <!-- Step 6: Custom Domain -->
          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
              <span class="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm mr-2">6</span>
              Configure Custom Domain (Optional)
            </h3>
            <ol class="space-y-3 text-sm text-gray-600">
              <li class="flex items-start">
                <span class="font-bold text-purple-600 mr-2">a.</span>
                Log in to Cloudflare Dashboard and go to Workers & Pages.
              </li>
              <li class="flex items-start">
                <span class="font-bold text-purple-600 mr-2">b.</span>
                Select your Worker, then click Settings → Triggers → Custom Domains.
              </li>
              <li class="flex items-start">
                <span class="font-bold text-purple-600 mr-2">c.</span>
                Add your domain (it must already be added to Cloudflare).
              </li>
            </ol>
          </div>

          <!-- Deployment Checklist -->
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 class="font-semibold text-purple-800 mb-2"><i class="fas fa-clipboard-check mr-1"></i>Post-Deployment Checklist</h4>
            <ul class="text-sm text-purple-700 space-y-1">
              <li><i class="fas fa-check-circle text-green-500 mr-1"></i>Visit <code>/</code> to see the status page.</li>
              <li><i class="fas fa-check-circle text-green-500 mr-1"></i>Visit <code>/admin</code> to log in to the admin panel.</li>
              <li><i class="fas fa-check-circle text-green-500 mr-1"></i>Add an API config and test the proxy functionality.</li>
              <li><i class="fas fa-check-circle text-green-500 mr-1"></i>Generate an SK alias for SDK configuration.</li>
            </ul>
          </div>
        </section>

        <!-- FAQ -->
        <section id="faq" class="section glass-effect rounded-xl p-6 shadow-lg mb-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4"><i class="fas fa-question-circle mr-2 text-purple-600"></i>FAQ</h2>

          <div class="space-y-4">
            <div class="border-b border-gray-100 pb-4">
              <h3 class="font-semibold text-gray-800 mb-2">Q: How do I get a Key ID?</h3>
              <p class="text-gray-600 text-sm">Log in to the <a href="/admin" class="text-purple-600 hover:underline">admin panel</a>. After adding an API configuration, the system will automatically generate a 6-digit Key ID.</p>
            </div>
            <div class="border-b border-gray-100 pb-4">
              <h3 class="font-semibold text-gray-800 mb-2">Q: Which APIs are supported?</h3>
              <p class="text-gray-600 text-sm"><strong>Any HTTP/HTTPS API</strong> is supported, including but not limited to: OpenAI, Anthropic, Google AI, Azure OpenAI, Groq, Mistral, Cohere, HuggingFace, etc.</p>
            </div>
            <div class="border-b border-gray-100 pb-4">
              <h3 class="font-semibold text-gray-800 mb-2">Q: Is my data secure?</h3>
              <p class="text-gray-600 text-sm">The proxy service does not store any request content; it only forwards requests. API tokens are stored in your database, and all transmission is encrypted via HTTPS.</p>
            </div>
            <div class="border-b border-gray-100 pb-4">
              <h3 class="font-semibold text-gray-800 mb-2">Q: How can I deploy it myself?</h3>
              <p class="text-gray-600 text-sm">Fork the <a href="https://github.com/dext7r/anyrouter" target="_blank" class="text-purple-600 hover:underline">GitHub repository</a> and configure Cloudflare Workers and a Supabase database. See the repository's README for details.</p>
            </div>
            <div class="border-b border-gray-100 pb-4">
              <h3 class="font-semibold text-gray-800 mb-2">Q: Are there any request limits?</h3>
              <p class="text-gray-600 text-sm">The proxy service itself has no limits, but you will be subject to the limits of Cloudflare's free plan (100,000 requests/day) and the limits of the target API.</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Q: Why use a proxy instead of connecting directly?</h3>
              <p class="text-gray-600 text-sm">1) Manage multiple API keys in one place. 2) Avoid exposing tokens on the client-side. 3) Accelerate requests with Cloudflare's edge network. 4) Easily monitor and track usage.</p>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="text-center text-gray-500 text-sm py-8">
          <p>Made with <i class="fas fa-heart text-red-400"></i> by <a href="https://github.com/dext7r" target="_blank" class="text-purple-600 hover:underline">dext7r</a></p>
          <p class="mt-2">Powered by Cloudflare Workers</p>
        </footer>
      </main>
    </div>
  </div>

  <script>
    // Set proxy URL
    const proxyUrl = window.location.origin;
    document.getElementById('proxyUrl').textContent = proxyUrl;
    document.querySelectorAll('.proxy-url').forEach(el => el.textContent = proxyUrl);

    // Load schema.sql from GitHub
    const SCHEMA_SQL_URL = 'https://raw.githubusercontent.com/dext7r/anyrouter/main/schema.sql';
    let schemaSQL = '';

    async function loadSchemaSQL() {
      const el = document.getElementById('deploy-sql');
      el.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading from GitHub...';
      try {
        const response = await fetch(SCHEMA_SQL_URL);
        if (!response.ok) throw new Error('HTTP ' + response.status);
        schemaSQL = await response.text();
        el.textContent = schemaSQL;
        hljs.highlightElement(el);
        showToast('schema.sql loaded successfully');
      } catch (e) {
        el.innerHTML = '-- Failed to load: ' + e.message + '\\n-- Please view the full script on GitHub:\\n-- https://github.com/dext7r/anyrouter/blob/main/schema.sql';
        console.error('Failed to load schema.sql:', e);
      }
    }

    // Auto-load schema.sql on page load
    loadSchemaSQL();

    // Collapse/expand schema.sql
    function toggleSchemaSQL() {
      const content = document.getElementById('schemaSqlContent');
      const toggle = document.getElementById('schemaSqlToggle');
      if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        toggle.style.transform = 'rotate(90deg)';
      } else {
        content.classList.add('hidden');
        toggle.style.transform = 'rotate(0deg)';
      }
    }

    // Copy Worker code
    const WORKER_JS_URL = 'https://raw.githubusercontent.com/dext7r/anyrouter/main/anyrouter.js';
    let workerCode = '';

    async function copyWorkerCode() {
      const btn = document.getElementById('copyWorkerBtn');
      const status = document.getElementById('copyWorkerStatus');
      const originalHTML = btn.innerHTML;

      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>Fetching...';
      status.textContent = '';

      try {
        // Use cached code if available
        if (!workerCode) {
          const response = await fetch(WORKER_JS_URL);
          if (!response.ok) throw new Error('HTTP ' + response.status);
          workerCode = await response.text();
        }

        await navigator.clipboard.writeText(workerCode);
        btn.innerHTML = '<i class="fas fa-check mr-1"></i>Copied!';
        status.innerHTML = '<i class="fas fa-check-circle text-green-500 mr-1"></i>Code copied to clipboard. Please paste it into the Cloudflare editor.';
        showToast('Worker code copied. Please paste it into Cloudflare.');

        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.disabled = false;
        }, 3000);
      } catch (e) {
        btn.innerHTML = '<i class="fas fa-times mr-1"></i>Copy Failed';
        status.innerHTML = '<i class="fas fa-exclamation-circle text-red-500 mr-1"></i>Failed to fetch: ' + e.message + '. Please <a href="' + WORKER_JS_URL + '" target="_blank" class="text-purple-600 underline">open manually</a> to copy.';
        console.error('Failed to copy worker code:', e);

        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.disabled = false;
        }, 3000);
      }
    }

    // Highlight code blocks
    hljs.highlightAll();

    // Copy function
    function copyToClipboard(elementId) {
      const text = document.getElementById(elementId).textContent;
      navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard');
      });
    }

    function copyCode(elementId) {
      const el = document.getElementById(elementId);
      let text = el.textContent;
      // If it's schema.sql and loaded, use the cached content
      if (elementId === 'deploy-sql' && schemaSQL) {
        text = schemaSQL;
      } else {
        text = text.replace(/<span class="proxy-url"><\\/span>/g, proxyUrl);
      }
      navigator.clipboard.writeText(text).then(() => {
        showToast('Code copied');
      });
    }

    function showToast(message) {
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-lg z-50';
      toast.innerHTML = '<i class="fas fa-check-circle mr-2"></i>' + message;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    }

    // TOC collapse/expand
    function toggleTOC() {
      const sidebar = document.getElementById('tocSidebar');
      sidebar.classList.toggle('collapsed');
    }

    // Switch deploy tabs
    function showDeployTab(tabName) {
      // Hide all content
      document.querySelectorAll('.deploy-content').forEach(el => el.classList.add('hidden'));
      // Reset all tab styles
      document.querySelectorAll('.deploy-tab').forEach(el => {
        el.classList.remove('text-purple-600', 'border-b-2', 'border-purple-600');
        el.classList.add('text-gray-500');
      });
      // Show selected content
      document.getElementById('deploy-' + tabName).classList.remove('hidden');
      // Activate selected tab
      const activeTab = document.getElementById('tab-' + tabName);
      activeTab.classList.remove('text-gray-500');
      activeTab.classList.add('text-purple-600', 'border-b-2', 'border-purple-600');
    }

    // Highlight TOC
    const sections = document.querySelectorAll('.section');
    const tocLinks = document.querySelectorAll('.toc-link');

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 100) {
          current = section.getAttribute('id');
        }
      });

      tocLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });
  </script>
</body>
</html>`
}
