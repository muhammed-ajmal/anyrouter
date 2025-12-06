// ============ Admin Page HTML ============

/**
 * Generates the HTML for the admin page.
 */
export function getAdminHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Proxy Admin</title>
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
    .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .glass-effect { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3); }
    .card-hover { transition: all 0.3s ease; }
    .card-hover:hover { transform: translateY(-2px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
    .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); transition: all 0.3s ease; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4); }
    .animate-fade-in { animation: fadeIn 0.5s ease-in; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .toast { position: fixed; top: 20px; right: 20px; padding: 16px 24px; border-radius: 12px; color: white; font-weight: 500; box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 9999; animation: slideIn 0.3s ease-out; }
    @keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    .toast-success { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
    .toast-error { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
    .toast-info { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
    .mini-input { padding: 6px 10px !important; font-size: 13px !important; }
    .mini-btn { padding: 6px 12px !important; font-size: 12px !important; }
    .mini-table th, .mini-table td { padding: 8px 10px !important; font-size: 12px !important; }
    .mini-card { padding: 16px !important; }
    .remark-cell { max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  </style>
</head>
<body class="gradient-bg min-h-screen">
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Login Form -->
    <div id="loginPanel" class="min-h-screen flex items-center justify-center animate-fade-in">
      <div class="glass-effect rounded-3xl shadow-2xl p-10 max-w-md w-full">
        <div class="text-center mb-8">
          <div class="inline-block p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
            <i class="fas fa-lock text-white text-3xl"></i>
          </div>
          <h2 class="text-3xl font-bold text-gray-800 mb-2">Admin Login</h2>
          <p class="text-gray-500">Enter the password to access the admin panel</p>
        </div>
        <div class="space-y-5">
          <div class="relative">
            <i class="fas fa-key absolute left-4 top-4 text-gray-400"></i>
            <input type="password" id="passwordInput" placeholder="Enter admin password" class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-all">
          </div>
          <button id="loginBtn" class="w-full py-3 btn-primary text-white rounded-xl font-semibold shadow-lg"><i class="fas fa-sign-in-alt mr-2"></i>Login</button>
          <div id="loginError" class="text-red-500 text-sm text-center hidden"></div>
        </div>
      </div>
    </div>

    <!-- Admin Panel -->
    <div id="adminPanel" class="hidden animate-fade-in">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-4xl font-bold text-white mb-2"><i class="fas fa-rocket mr-3"></i>API Proxy Admin Center</h1>
          <p class="text-purple-100">Manage your API endpoints and key configurations</p>
        </div>
        <div class="flex gap-3">
          <a href="/docs" class="glass-effect px-6 py-3 text-purple-700 rounded-xl hover:bg-white transition-all font-semibold shadow-lg"><i class="fas fa-book mr-2"></i>Docs</a>
          <a href="https://github.com/dext7r/anyrouter" target="_blank" class="glass-effect px-6 py-3 text-purple-700 rounded-xl hover:bg-white transition-all font-semibold shadow-lg"><i class="fab fa-github mr-2"></i>GitHub</a>
          <button id="logoutBtn" class="glass-effect px-6 py-3 text-purple-700 rounded-xl hover:bg-white transition-all font-semibold shadow-lg"><i class="fas fa-sign-out-alt mr-2"></i>Logout</button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div id="statsCards" class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div class="glass-effect rounded-2xl p-4 card-hover">
          <div class="flex items-center justify-between mb-2">
            <div>
              <p class="text-gray-500 text-xs font-medium mb-1">Storage Mode</p>
              <h3 id="storageMode" class="text-sm font-bold text-gray-800">Detecting...</h3>
            </div>
            <div id="storageModeIcon" class="p-3 bg-gray-100 rounded-xl"><i class="fas fa-circle-notch fa-spin text-gray-400 text-xl"></i></div>
          </div>
          <div id="dbStatus" class="text-xs text-gray-500"><span id="dbStatusText">Detecting...</span></div>
        </div>
        <div class="glass-effect rounded-2xl p-4 card-hover">
          <div class="flex items-center justify-between mb-2">
            <div>
              <p class="text-gray-500 text-xs font-medium mb-1">Redis Cache</p>
              <h3 id="redisStatus" class="text-sm font-bold text-gray-800">Detecting...</h3>
            </div>
            <div id="redisIcon" class="p-3 bg-gray-100 rounded-xl"><i class="fas fa-circle-notch fa-spin text-gray-400 text-xl"></i></div>
          </div>
          <div id="redisStatusText" class="text-xs text-gray-500">Detecting...</div>
        </div>
        <div class="glass-effect rounded-2xl p-4 card-hover">
          <div class="flex items-center justify-between">
            <div><p class="text-gray-500 text-xs font-medium mb-1">Total APIs</p><h3 id="totalApis" class="text-2xl font-bold text-gray-800">0</h3></div>
            <div class="p-4 bg-blue-100 rounded-xl"><i class="fas fa-server text-blue-600 text-2xl"></i></div>
          </div>
        </div>
        <div class="glass-effect rounded-2xl p-6 card-hover">
          <div class="flex items-center justify-between">
            <div><p class="text-gray-500 text-sm font-medium mb-1">Total Keys</p><h3 id="totalKeys" class="text-3xl font-bold text-gray-800">0</h3></div>
            <div class="p-4 bg-purple-100 rounded-xl"><i class="fas fa-key text-purple-600 text-2xl"></i></div>
          </div>
        </div>
        <div class="glass-effect rounded-2xl p-6 card-hover">
          <div class="flex items-center justify-between">
            <div><p class="text-gray-500 text-sm font-medium mb-1">Enabled</p><h3 id="enabledKeys" class="text-3xl font-bold text-green-600">0</h3></div>
            <div class="p-4 bg-green-100 rounded-xl"><i class="fas fa-check-circle text-green-600 text-2xl"></i></div>
          </div>
        </div>
      </div>

      <!-- Stats Charts -->
      <div id="statsCharts" class="glass-effect rounded-2xl shadow-xl mb-6 overflow-hidden">
        <div class="p-4 cursor-pointer flex items-center justify-between hover:bg-purple-50 transition-all" onclick="toggleStats()">
          <h2 class="text-lg font-bold text-gray-800"><i class="fas fa-chart-line mr-2 text-purple-600"></i>Request Statistics</h2>
          <div class="flex gap-2 items-center">
            <span id="statsSummary" class="text-xs text-gray-500"></span>
            <button id="refreshStatsBtn" class="mini-btn bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200" onclick="event.stopPropagation(); loadStats(true);"><i class="fas fa-sync-alt"></i></button>
            <i id="statsToggle" class="fas fa-chevron-down text-purple-600 transition-transform"></i>
          </div>
        </div>
        <div id="statsContent" class="hidden border-t border-purple-100">
          <div class="p-4">
            <!-- Empty State -->
            <div id="statsEmpty" class="hidden text-center py-8">
              <div class="text-gray-300 mb-4"><i class="fas fa-chart-area text-6xl"></i></div>
              <h3 class="text-lg font-medium text-gray-500 mb-2">No stats available</h3>
              <p id="statsEmptyText" class="text-sm text-gray-400">Request statistics will be recorded automatically after you make a proxy request.</p>
            </div>
            <!-- Chart Content -->
            <div id="statsChartsContent">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-white rounded-xl p-4 shadow-sm">
                  <h3 class="text-sm font-medium text-gray-600 mb-2">Daily Requests (last 7 days)</h3>
                  <canvas id="dailyChart" height="200"></canvas>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm">
                  <h3 class="text-sm font-medium text-gray-600 mb-2">Hourly Requests (last 24 hours)</h3>
                  <canvas id="hourlyChart" height="200"></canvas>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div class="bg-white rounded-xl p-4 shadow-sm">
                  <h3 class="text-sm font-medium text-gray-600 mb-2">Today's Top APIs</h3>
                  <canvas id="urlPieChart" height="200"></canvas>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm">
                  <h3 class="text-sm font-medium text-gray-600 mb-2">Today's Top Keys</h3>
                  <div id="keyRankList" class="space-y-2 max-h-48 overflow-y-auto"></div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm">
                  <h3 class="text-sm font-medium text-gray-600 mb-2"><i class="fas fa-globe mr-1 text-blue-500"></i>Today's Top IPs</h3>
                  <div id="ipRankList" class="space-y-1 max-h-36 overflow-y-auto text-xs"></div>
                  <div class="mt-2 pt-2 border-t border-gray-100">
                    <h4 class="text-xs font-medium text-red-600 mb-1"><i class="fas fa-ban mr-1"></i>Blacklist <span id="blacklistCount" class="bg-red-100 px-1 rounded">0</span></h4>
                    <div id="blacklistContent" class="space-y-1 max-h-24 overflow-y-auto text-xs"></div>
                  </div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm">
                  <h3 class="text-sm font-medium text-gray-600 mb-2"><i class="fas fa-user-clock mr-1 text-purple-500"></i>Login History</h3>
                  <div id="loginRecordsList" class="space-y-1 max-h-48 overflow-y-auto text-xs"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add New Config Card -->
      <div class="glass-effect rounded-2xl shadow-xl mini-card mb-6 card-hover">
        <h2 class="text-lg font-bold text-gray-800 mb-4"><i class="fas fa-plus-circle mr-2 text-purple-600"></i>Add New Configuration</h2>
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div class="md:col-span-3">
            <label class="block text-xs font-medium text-gray-600 mb-1">API URL</label>
            <input type="text" id="newApiUrl" list="existingUrls" placeholder="https://api.example.com" class="w-full mini-input border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-all">
            <datalist id="existingUrls"></datalist>
          </div>
          <div class="md:col-span-3">
            <label class="block text-xs font-medium text-gray-600 mb-1">Token</label>
            <input type="text" id="newToken" placeholder="sk-xxxxxxxxxxxxxxxx" class="w-full mini-input border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-all">
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-medium text-gray-600 mb-1">Remark</label>
            <input type="text" id="newRemark" placeholder="Optional" maxlength="255" class="w-full mini-input border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-all">
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-medium text-gray-600 mb-1">Expires At</label>
            <input type="datetime-local" id="newExpiresAt" class="w-full mini-input border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-all" title="Leave blank for no expiration">
          </div>
          <div class="md:col-span-1">
            <label class="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select id="newEnabled" class="w-full mini-input border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-all">
              <option value="true">✓</option>
              <option value="false">✗</option>
            </select>
          </div>
          <div class="md:col-span-1 flex items-end">
            <button id="addBtn" class="w-full mini-btn btn-primary text-white rounded-lg font-medium shadow"><i class="fas fa-plus"></i></button>
          </div>
        </div>
      </div>

      <!-- Configs Table -->
      <div class="glass-effect rounded-2xl shadow-xl mini-card">
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-lg font-bold text-gray-800"><i class="fas fa-table mr-2 text-purple-600"></i>Configuration List</h2>
          <div class="flex gap-2">
            <button onclick="copyAllTokens()" class="mini-btn bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all font-medium" title="Copy All"><i class="fas fa-copy"></i></button>
            <select id="sortBy" class="mini-input bg-purple-50 text-purple-700 rounded-lg font-medium focus:outline-none border-0">
              <option value="created_at">Created Time</option>
              <option value="updated_at">Updated Time</option>
              <option value="api_url">API URL</option>
              <option value="enabled">Status</option>
            </select>
            <button id="refreshBtn" class="mini-btn bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all font-medium"><i class="fas fa-sync-alt"></i></button>
          </div>
        </div>
        <div class="mb-3">
          <input type="text" id="searchInput" placeholder="Search API URL, Token, or Remark..." class="w-full mini-input border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-all" oninput="filterConfigs()">
        </div>
        <div class="overflow-x-auto">
          <table id="configsTable" class="w-full mini-table">
            <thead>
              <tr class="border-b border-purple-200">
                <th class="text-left py-2 px-2 font-medium text-gray-600 text-xs">API URL</th>
                <th class="text-center py-2 px-2 font-medium text-gray-600 text-xs">ID</th>
                <th class="text-left py-2 px-2 font-medium text-gray-600 text-xs">SK Alias</th>
                <th class="text-left py-2 px-2 font-medium text-gray-600 text-xs">Token</th>
                <th class="text-left py-2 px-2 font-medium text-gray-600 text-xs">Remark</th>
                <th class="text-center py-2 px-2 font-medium text-gray-600 text-xs">Expires</th>
                <th class="text-center py-2 px-2 font-medium text-gray-600 text-xs">Status</th>
                <th class="text-left py-2 px-2 font-medium text-gray-600 text-xs">Created</th>
                <th class="text-left py-2 px-2 font-medium text-gray-600 text-xs">Last Request</th>
                <th class="text-center py-2 px-2 font-medium text-gray-600 text-xs">Actions</th>
              </tr>
            </thead>
            <tbody id="configsTableBody">
              <tr><td colspan="10" class="text-center text-gray-500 py-8"><i class="fas fa-spinner fa-spin text-2xl mb-2 text-purple-400"></i><p class="text-sm">Loading...</p></td></tr>
            </tbody>
          </table>
        </div>
        <div id="pagination"></div>
      </div>
    </div>
  </div>

  <!-- Edit Modal -->
  <div id="editModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style="backdrop-filter: blur(5px);">
    <div class="glass-effect rounded-xl shadow-2xl p-5 max-w-md w-full mx-4 animate-fade-in">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold text-gray-800"><i class="fas fa-edit mr-2 text-purple-600"></i>Edit Configuration</h3>
        <button onclick="closeEditModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
      </div>
      <div class="space-y-3">
        <div><label class="block text-xs font-medium text-gray-600 mb-1">API URL</label><input type="text" id="editApiUrl" class="w-full mini-input border border-gray-200 rounded-lg bg-gray-50" readonly></div>
        <div><label class="block text-xs font-medium text-gray-600 mb-1">Token</label><input type="text" id="editToken" class="w-full mini-input border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-all font-mono" placeholder="sk-xxxxxxxxxxxxxxxx"></div>
        <div><label class="block text-xs font-medium text-gray-600 mb-1">SK Alias</label><div class="flex gap-2"><input type="text" id="editSkAlias" class="flex-1 mini-input border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-all font-mono text-orange-700" placeholder="sk-ar-xxx (leave blank for none)" maxlength="50"><button type="button" id="genSkAliasBtn" class="mini-btn bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200" title="Generate new alias"><i class="fas fa-sync-alt"></i></button></div><p class="text-xs text-gray-400 mt-1">Enter manually or click button to generate</p></div>
        <div><label class="block text-xs font-medium text-gray-600 mb-1">Remark</label><input type="text" id="editRemark" class="w-full mini-input border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-all" placeholder="Optional remark" maxlength="255"></div>
        <div><label class="block text-xs font-medium text-gray-600 mb-1">Expires At</label><input type="datetime-local" id="editExpiresAt" class="w-full mini-input border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-all"><p class="text-xs text-gray-400 mt-1">Leave blank for no expiration</p></div>
        <div><label class="block text-xs font-medium text-gray-600 mb-1">Status</label><select id="editEnabled" class="w-full mini-input border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-all"><option value="true">Enabled</option><option value="false">Disabled</option></select></div>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <button onclick="closeEditModal()" class="mini-btn bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium">Cancel</button>
        <button id="saveEditBtn" class="mini-btn btn-primary text-white rounded-lg font-medium shadow"><i class="fas fa-save mr-1"></i>Save</button>
      </div>
    </div>
  </div>

  <script>
    let authToken = localStorage.getItem('authToken');
    let currentConfigs = [];
    let currentEditId = null;
    let isDatabaseMode = false;
    let currentPage = 1;
    const pageSize = 10;

    $(document).ready(function() {
      if (authToken) { showAdminPanel(); } else { showLoginPanel(); }
      const proxyUrl = window.location.origin;
      $('#proxyUrlExample').text(proxyUrl);
      $('.proxy-url-placeholder').text(proxyUrl);
    });

    $('#loginBtn').click(async function() {
      const password = $('#passwordInput').val().trim();
      if (!password) { showError('Please enter password'); return; }
      const btn = $(this);
      btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin mr-2"></i>Logging in...');
      authToken = password;
      localStorage.setItem('authToken', password);
      await loadConfigs(true);
      btn.prop('disabled', false).html('<i class="fas fa-sign-in-alt mr-2"></i>Login');
    });

    $('#passwordInput').keypress(function(e) { if (e.which === 13) { $('#loginBtn').click(); } });
    $('#logoutBtn').click(function() { authToken = null; localStorage.removeItem('authToken'); stopStatsAutoRefresh(); showLoginPanel(); showToast('Logged out', 'info'); });
    $('#refreshBtn').click(async function() {
      const btn = $(this);
      btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i>');
      await loadConfigs();
      btn.prop('disabled', false).html('<i class="fas fa-sync-alt"></i>');
      showToast('Configurations have been refreshed', 'info');
    });

    $('#addBtn').click(async function() {
      const apiUrl = $('#newApiUrl').val().trim();
      const token = $('#newToken').val().trim();
      const remark = $('#newRemark').val().trim();
      const expiresAtVal = $('#newExpiresAt').val();
      const expiresAt = expiresAtVal ? new Date(expiresAtVal).toISOString() : null;
      const enabled = $('#newEnabled').val() === 'true';
      if (!apiUrl || !token) { showToast('Please enter API URL and Token', 'error'); return; }
      const btn = $(this);
      btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i>');
      try {
        const response = await fetch('/api/configs', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken }, body: JSON.stringify({ api_url: apiUrl, token, enabled, remark, expires_at: expiresAt }) });
        const result = await response.json();
        if (result.success) { $('#newApiUrl').val(''); $('#newToken').val(''); $('#newRemark').val(''); $('#newExpiresAt').val(''); loadConfigs(); showToast('Successfully added', 'success'); } else { showToast('Failed to add: ' + result.error, 'error'); }
      } catch (error) { showToast('Request failed: ' + error.message, 'error'); }
      finally { btn.prop('disabled', false).html('<i class="fas fa-plus"></i>'); }
    });

    let lastUsedTimes = {}; // key_id -> ISO string
    let isLoadingConfigs = false;

    async function loadConfigs(isLoginAttempt = false) {
      if (isLoadingConfigs) return;
      isLoadingConfigs = true;
      // Show table loading state
      if (!isLoginAttempt) {
        $('#configsTableBody').html('<tr><td colspan="10" class="text-center text-gray-500 py-8"><i class="fas fa-spinner fa-spin text-2xl mb-2 text-purple-400"></i><p class="text-sm">Loading...</p></td></tr>');
      }
      try {
        const response = await fetch('/api/configs', { headers: { 'Authorization': 'Bearer ' + authToken } });
        if (response.status === 401) { showError('Incorrect password, please log in again'); localStorage.removeItem('authToken'); showLoginPanel(); return; }
        const result = await response.json();
        if (result.success) {
          if (isLoginAttempt) {
            $('#loginPanel').addClass('hidden');
            $('#adminPanel').removeClass('hidden');
            checkSystemStatus();
            // Record login
            fetch('/api/login', { method: 'POST', headers: { 'Authorization': 'Bearer ' + authToken } }).catch(() => {});
          }
          lastUsedTimes = result.lastUsed || {};
          renderConfigs(result.data);
        }
        else { showError('Failed to load: ' + result.error); }
      } catch (error) { showError('Request failed: ' + error.message); }
      finally { isLoadingConfigs = false; }
    }

    function renderConfigs(configs) {
      const rows = [];
      Object.entries(configs).forEach(([apiUrl, config]) => {
        config.keys.forEach(key => { rows.push({ id: key.id, key_id: key.key_id, sk_alias: key.sk_alias || null, api_url: apiUrl, token: key.token, enabled: key.enabled, remark: key.remark || '', expires_at: key.expires_at || null, created_at: key.created_at, updated_at: key.updated_at }); });
      });
      currentConfigs = rows;
      const uniqueApis = new Set(rows.map(r => r.api_url)).size;
      const enabledCount = rows.filter(r => r.enabled).length;
      $('#totalApis').text(uniqueApis);
      $('#totalKeys').text(rows.length);
      $('#enabledKeys').text(enabledCount);
      updateUrlDatalist(rows);
      sortConfigs();
    }

    function updateUrlDatalist(rows) {
      const uniqueUrls = [...new Set(rows.map(r => r.api_url))].sort();
      const datalist = $('#existingUrls');
      datalist.empty();
      uniqueUrls.forEach(url => { const tokenCount = rows.filter(r => r.api_url === url).length; datalist.append('<option value="' + url + '">' + url + ' (' + tokenCount + ' tokens)</option>'); });
    }

    function sortConfigs() {
      const sortBy = $('#sortBy').val();
      let sorted = [...currentConfigs];
      sorted.sort((a, b) => a.api_url.localeCompare(b.api_url));
      sorted.sort((a, b) => {
        if (sortBy === 'created_at' || sortBy === 'updated_at') { return new Date(b[sortBy]) - new Date(a[sortBy]); }
        else if (sortBy === 'enabled') { return b.enabled - a.enabled; }
        else if (sortBy === 'api_url') { return a.api_url.localeCompare(b.api_url); }
        return 0;
      });
      renderTable(sorted);
    }

    window.filterConfigs = function() {
      const searchText = $('#searchInput').val().toLowerCase();
      if (!searchText) { sortConfigs(); return; }
      const filtered = currentConfigs.filter(row => row.api_url.toLowerCase().includes(searchText) || row.token.toLowerCase().includes(searchText) || maskToken(row.token).toLowerCase().includes(searchText) || (row.remark && row.remark.toLowerCase().includes(searchText)));
      renderTable(filtered);
    }

    window.copyAllTokens = function() {
      if (currentConfigs.length === 0) { showToast('No configurations found', 'error'); return; }
      const tokens = currentConfigs.filter(r => r.enabled).map(r => r.api_url + ': ' + r.token).join('\\n');
      navigator.clipboard.writeText(tokens).then(() => { showToast('✓ Copied ' + currentConfigs.filter(r => r.enabled).length + ' enabled tokens', 'success'); }).catch(() => { showToast('Copy failed', 'error'); });
    }

    function renderTable(rows) {
      if (rows.length === 0) {
        const emptyMsg = isDatabaseMode ? '<p class="text-xs text-gray-400 mt-1">Click the button above to add your first configuration</p>' : '<p class="text-xs text-yellow-600 mt-1"><i class="fas fa-info-circle mr-1"></i>Passthrough mode, no configuration needed</p>';
        $('#configsTableBody').html('<tr><td colspan="10" class="text-center text-gray-500 py-8"><i class="fas ' + (isDatabaseMode ? 'fa-inbox' : 'fa-bolt') + ' text-3xl mb-2 ' + (isDatabaseMode ? 'text-gray-300' : 'text-yellow-300') + '"></i><p class="text-sm font-medium">' + (isDatabaseMode ? 'No configurations yet' : 'Passthrough Mode') + '</p>' + emptyMsg + '</td></tr>');
        $('#pagination').html('');
        return;
      }
      const grouped = {};
      rows.forEach(row => { if (!grouped[row.api_url]) { grouped[row.api_url] = []; } grouped[row.api_url].push(row); });
      const apiUrls = Object.keys(grouped).sort();
      const totalPages = Math.ceil(apiUrls.length / pageSize);
      const startIdx = (currentPage - 1) * pageSize;
      const pagedUrls = apiUrls.slice(startIdx, startIdx + pageSize);
      let html = '';
      pagedUrls.forEach((apiUrl, urlIdx) => {
        const tokens = grouped[apiUrl];
        const enabledCount = tokens.filter(t => t.enabled).length;
        const urlId = 'url-' + urlIdx + '-' + startIdx;
        // Default collapsed, arrow to the right
        html += '<tr class="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200 cursor-pointer url-header-row" data-url-id="' + urlId + '"><td colspan="10" class="py-2 px-3"><div class="flex items-center justify-between"><div class="flex items-center gap-2"><i class="fas fa-chevron-right text-purple-600 text-xs transition-transform url-toggle" id="toggle-' + urlId + '"></i><a href="' + apiUrl + '" target="_blank" class="font-medium text-xs text-purple-700 hover:text-purple-900 hover:underline truncate max-w-xs" onclick="event.stopPropagation()" title="' + apiUrl + '">' + apiUrl + '</a><span class="px-2 py-0.5 bg-purple-200 text-purple-700 rounded-full text-xs">' + tokens.length + '</span><span class="px-2 py-0.5 ' + (enabledCount > 0 ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-500') + ' rounded-full text-xs">' + enabledCount + ' enabled</span></div><div class="flex items-center gap-1 action-buttons"><button class="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded hover:bg-blue-200 transition-all copy-url-btn" title="Copy" data-url="' + encodeURIComponent(apiUrl) + '"><i class="fas fa-copy"></i></button>' + (isDatabaseMode ? '<button class="px-2 py-1 bg-green-100 text-green-600 text-xs rounded hover:bg-green-200 transition-all add-token-btn" title="Add" data-url="' + encodeURIComponent(apiUrl) + '"><i class="fas fa-plus"></i></button>' : '') + '</div></div></td></tr>';
        tokens.forEach((row, tokenIdx) => {
          const safeRemark = escapeHtml(row.remark);
          const keyId = row.key_id || row.id;
          const skAlias = row.sk_alias;
          const skAliasHtml = skAlias
            ? '<code class="text-xs font-mono bg-orange-100 px-1 py-0.5 rounded text-orange-700 cursor-pointer hover:bg-orange-200 sk-copy-btn" title="Click to copy">' + skAlias.substring(0, 16) + '...</code><button class="ml-1 text-orange-500 hover:text-orange-700 gen-sk-btn" data-id="' + row.id + '" title="Regenerate"><i class="fas fa-sync-alt text-xs"></i></button>'
            : '<button class="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded hover:bg-orange-100 gen-sk-btn" data-id="' + row.id + '"><i class="fas fa-plus mr-1"></i>Generate</button>';
          // Expiry display
          const expiresHtml = formatExpiry(row.expires_at);
          // Last used time
          const lastUsedTime = lastUsedTimes[keyId] ? formatDate(lastUsedTimes[keyId]) : '-';
          // Default hidden token-row
          html += '<tr class="border-b border-gray-50 hover:bg-purple-50 transition-all token-row token-row-' + urlId + ' hidden"><td class="py-1.5 px-2 pl-6"><span class="text-gray-400 text-xs">#' + (tokenIdx + 1) + '</span></td><td class="py-1.5 px-2 text-center"><div class="flex items-center justify-center gap-1"><code class="text-xs font-mono bg-purple-100 px-1.5 py-0.5 rounded text-purple-700 cursor-pointer hover:bg-purple-200 id-copy-btn" title="Click to copy">' + keyId + '</code><button class="p-0.5 text-xs bg-green-100 text-green-600 rounded hover:bg-green-200 full-key-copy-btn" data-url="' + encodeURIComponent(apiUrl) + '" data-keyid="' + keyId + '" title="Copy full key"><i class="fas fa-link text-xs"></i></button></div></td><td class="py-1.5 px-2">' + skAliasHtml + '</td><td class="py-1.5 px-2"><code class="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 cursor-pointer hover:bg-gray-200 token-copy-btn" data-token="' + window.btoa(row.token) + '" title="Click to copy">' + maskToken(row.token) + '</code></td><td class="py-1.5 px-2 remark-cell text-xs text-gray-500" title="' + safeRemark + '">' + (safeRemark || '-') + '</td><td class="py-1.5 px-2 text-center text-xs">' + expiresHtml + '</td><td class="py-1.5 px-2 text-center"><input type="checkbox" ' + (row.enabled ? 'checked' : '') + ' class="w-3 h-3 text-green-600 rounded status-checkbox" data-id="' + row.id + '"></td><td class="py-1.5 px-2 text-xs text-gray-400">' + formatDate(row.created_at) + '</td><td class="py-1.5 px-2 text-xs text-gray-400">' + lastUsedTime + '</td><td class="py-1.5 px-2 text-center"><button class="p-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 edit-key-btn" data-id="' + row.id + '"><i class="fas fa-edit text-xs"></i></button> <button class="p-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 delete-key-action-btn" data-id="' + row.id + '"><i class="fas fa-trash-alt text-xs"></i></button></td></tr>';
        });
      });
      $('#configsTableBody').html(html);
      renderPagination(totalPages, apiUrls.length);
    }

    function renderPagination(totalPages, totalItems) {
      if (totalPages <= 1) { $('#pagination').html(''); return; }
      let pHtml = '<div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-100"><div class="text-xs text-gray-400">' + totalItems + ' APIs · ' + currentPage + '/' + totalPages + '</div><div class="flex gap-1">';
      if (currentPage > 1) pHtml += '<button class="px-2 py-0.5 bg-purple-100 text-purple-600 rounded text-xs hover:bg-purple-200 page-btn" data-page="' + (currentPage - 1) + '"><i class="fas fa-chevron-left"></i></button>';
      for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) { pHtml += '<button class="px-2 py-0.5 ' + (i === currentPage ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600 hover:bg-purple-200') + ' rounded text-xs page-btn" data-page="' + i + '">' + i + '</button>'; }
      if (currentPage < totalPages) pHtml += '<button class="px-2 py-0.5 bg-purple-100 text-purple-600 rounded text-xs hover:bg-purple-200 page-btn" data-page="' + (currentPage + 1) + '"><i class="fas fa-chevron-right"></i></button>';
      pHtml += '</div></div>';
      $('#pagination').html(pHtml);
    }

    $(document).on('click', '.token-copy-btn', function() { const encodedToken = $(this).data('token'); if (encodedToken) { copyToken(window.atob(encodedToken)); } });
    $(document).on('click', '.id-copy-btn', function() { const id = $(this).text(); navigator.clipboard.writeText(id).then(() => { showToast('ID ' + id + ' copied', 'success'); }); });
    $(document).on('click', '.full-key-copy-btn', function() { const url = decodeURIComponent($(this).data('url')); const keyId = $(this).data('keyid'); const fullKey = url + ':' + keyId; navigator.clipboard.writeText(fullKey).then(() => { showToast('✓ Full key copied', 'success'); }).catch(() => { const textarea = document.createElement('textarea'); textarea.value = fullKey; document.body.appendChild(textarea); textarea.select(); document.execCommand('copy'); document.body.removeChild(textarea); showToast('✓ Full key copied', 'success'); }); });
    // SK Alias Copy
    $(document).on('click', '.sk-copy-btn', function() { const row = currentConfigs.find(r => r.id == $(this).closest('tr').find('.status-checkbox').data('id')); if (row && row.sk_alias) { navigator.clipboard.writeText(row.sk_alias).then(() => { showToast('✓ SK Alias copied', 'success'); }); } });
    // Generate/Regenerate SK Alias
    $(document).on('click', '.gen-sk-btn', async function(e) { e.stopPropagation(); const id = $(this).data('id'); const btn = $(this); btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i>'); try { const response = await fetch('/api/configs/' + id + '/sk-alias', { method: 'POST', headers: { 'Authorization': 'Bearer ' + authToken } }); const result = await response.json(); if (result.success) { showToast('✓ SK Alias generated', 'success'); loadConfigs(); } else { showToast('Generation failed: ' + result.error, 'error'); btn.prop('disabled', false).html('<i class="fas fa-plus mr-1"></i>Generate'); } } catch (error) { showToast('Request failed: ' + error.message, 'error'); btn.prop('disabled', false).html('<i class="fas fa-plus mr-1"></i>Generate'); } });
    $(document).on('change', '.status-checkbox', function() { toggleKey($(this).data('id'), $(this).is(':checked')); });
    $(document).on('click', '.edit-key-btn', function() { openEditModal($(this).data('id')); });
    $(document).on('click', '.delete-key-action-btn', function() { deleteKey($(this).data('id')); });
    $(document).on('click', '.copy-url-btn', function() { const proxyUrl = window.location.origin; navigator.clipboard.writeText(proxyUrl).then(() => { showToast('✓ Proxy URL copied: ' + proxyUrl, 'success'); }).catch(() => { const textarea = document.createElement('textarea'); textarea.value = proxyUrl; document.body.appendChild(textarea); textarea.select(); document.execCommand('copy'); document.body.removeChild(textarea); showToast('✓ Proxy URL copied', 'success'); }); });
    $(document).on('click', '.add-token-btn', function() { const url = decodeURIComponent($(this).data('url')); $('#newApiUrl').val(url); $('html, body').animate({ scrollTop: $('#newApiUrl').offset().top - 100 }, 300, function() { $('#newToken').focus(); $('#newToken').addClass('ring-2 ring-purple-500'); setTimeout(() => $('#newToken').removeClass('ring-2 ring-purple-500'), 2000); }); showToast('URL pre-filled, please enter Token', 'info'); });
    $(document).on('click', '.url-header-row', function(e) { if ($(e.target).closest('.action-buttons').length > 0) { return; } const urlId = $(this).data('url-id'); const toggle = $('#toggle-' + urlId); const rows = $('.token-row-' + urlId); if (toggle.hasClass('fa-chevron-down')) { toggle.removeClass('fa-chevron-down').addClass('fa-chevron-right'); rows.hide(); } else { toggle.removeClass('fa-chevron-right').addClass('fa-chevron-down'); rows.show(); } });
    $(document).on('click', '.page-btn', function() { currentPage = parseInt($(this).data('page')); sortConfigs(); });
    $('#sortBy').change(function() { sortConfigs(); });

    window.openEditModal = function(id) { const config = currentConfigs.find(c => c.id === id); if (!config) return; currentEditId = id; $('#editApiUrl').val(config.api_url); $('#editToken').val(config.token); $('#editSkAlias').val(config.sk_alias || ''); $('#editRemark').val(config.remark || ''); $('#editExpiresAt').val(config.expires_at ? toLocalDateTimeString(config.expires_at) : ''); $('#editEnabled').val(config.enabled.toString()); $('#editModal').removeClass('hidden'); };
    window.closeEditModal = function() { $('#editModal').addClass('hidden'); currentEditId = null; };

    $('#saveEditBtn').click(async function() {
      if (!currentEditId) return;
      const token = $('#editToken').val().trim();
      const skAlias = $('#editSkAlias').val().trim();
      const remark = $('#editRemark').val().trim();
      const expiresAtVal = $('#editExpiresAt').val();
      const expiresAt = expiresAtVal ? new Date(expiresAtVal).toISOString() : null;
      const enabled = $('#editEnabled').val() === 'true';
      if (!token) { showToast('Token cannot be empty', 'error'); return; }
      if (skAlias && !skAlias.startsWith('sk-ar-')) { showToast('SK Alias must start with sk-ar-', 'error'); return; }
      const btn = $(this);
      btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i>');
      try {
        const response = await fetch('/api/configs/' + currentEditId, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken }, body: JSON.stringify({ token, enabled, remark, expires_at: expiresAt, sk_alias: skAlias || null }) });
        const result = await response.json();
        if (result.success) { showToast('Successfully updated', 'success'); closeEditModal(); loadConfigs(); } else { showToast('Update failed: ' + result.error, 'error'); }
      } catch (error) { showToast('Request failed: ' + error.message, 'error'); }
      finally { btn.prop('disabled', false).html('<i class="fas fa-save mr-1"></i>Save'); }
    });

    $('#editModal').click(function(e) { if (e.target === this) { closeEditModal(); } });

    // Generate SK Alias in modal
    $('#genSkAliasBtn').click(function() {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = 'sk-ar-';
      for (let i = 0; i < 32; i++) { result += chars.charAt(Math.floor(Math.random() * chars.length)); }
      $('#editSkAlias').val(result);
      showToast('New SK alias generated (effective after saving)', 'info');
    });

    window.toggleKey = async function(id, enabled) {
      try {
        const response = await fetch('/api/configs/' + id, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken }, body: JSON.stringify({ enabled }) });
        const result = await response.json();
        if (result.success) { showToast(enabled ? 'Key enabled' : 'Key disabled', 'success'); loadConfigs(); } else { showToast('Update failed: ' + result.error, 'error'); loadConfigs(); }
      } catch (error) { showToast('Request failed: ' + error.message, 'error'); }
    };

    window.deleteKey = async function(id) {
      if (!confirm('⚠️ Are you sure you want to delete this configuration?')) { return; }
      try {
        const response = await fetch('/api/configs/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + authToken } });
        const result = await response.json();
        if (result.success) { loadConfigs(); showToast('Configuration deleted', 'success'); } else { showToast('Delete failed: ' + result.error, 'error'); }
      } catch (error) { showToast('Request failed: ' + error.message, 'error'); }
    };

    function maskToken(token) { if (!token) return ''; if (token.length <= 10) return token; return token.substring(0, 8) + '...' + token.substring(token.length - 4); }
    window.copyToken = function(token) { if (!token) { showToast('Invalid token', 'error'); return; } navigator.clipboard.writeText(token).then(() => { showToast('✓ Token copied to clipboard', 'success'); }).catch(() => { const textarea = document.createElement('textarea'); textarea.value = token; document.body.appendChild(textarea); textarea.select(); document.execCommand('copy'); document.body.removeChild(textarea); showToast('✓ Token copied to clipboard', 'success'); }); }
    function formatDate(dateString) { if (!dateString) return '-'; const date = new Date(dateString); if (isNaN(date.getTime())) return '-'; const pad = (n) => n.toString().padStart(2, '0'); return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()); }
    function formatExpiry(expiresAt) { if (!expiresAt) return '<span class="text-green-600"><i class="fas fa-infinity"></i></span>'; const expDate = new Date(expiresAt); const now = new Date(); if (expDate < now) return '<span class="text-red-500" title="Expired"><i class="fas fa-times-circle"></i> Expired</span>'; const diffDays = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24)); if (diffDays <= 7) return '<span class="text-yellow-600" title="' + formatDate(expiresAt) + '"><i class="fas fa-exclamation-triangle"></i> ' + diffDays + ' days</span>'; return '<span class="text-gray-500" title="' + formatDate(expiresAt) + '">' + diffDays + ' days</span>'; }
    function toLocalDateTimeString(isoString) { if (!isoString) return ''; const date = new Date(isoString); const pad = (n) => n.toString().padStart(2, '0'); return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()); }
    function escapeHtml(str) { if (!str) return ''; return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }
    function showLoginPanel() { $('#loginPanel').removeClass('hidden'); $('#adminPanel').addClass('hidden'); }
    function showAdminPanel() { $('#loginPanel').addClass('hidden'); $('#adminPanel').removeClass('hidden'); checkSystemStatus(); testRedis(); loadConfigs(); loadStats(); loadBlacklist(); startStatsAutoRefresh(); }

    // Toggle stats charts
    window.toggleStats = function() {
      const content = $('#statsContent');
      const toggle = $('#statsToggle');
      if (content.hasClass('hidden')) {
        content.removeClass('hidden');
        toggle.css('transform', 'rotate(180deg)');
      } else {
        content.addClass('hidden');
        toggle.css('transform', 'rotate(0deg)');
      }
    };

    // ============ Stats Charts ============
    let dailyChart = null;
    let hourlyChart = null;
    let urlPieChart = null;
    let statsAutoRefreshTimer = null;
    let isLoadingStats = false;

    async function loadStats(showToastMsg = false) {
      if (isLoadingStats) return;
      isLoadingStats = true;

      const empty = $('#statsEmpty');
      const emptyText = $('#statsEmptyText');
      const content = $('#statsChartsContent');
      const summary = $('#statsSummary');
      const refreshBtn = $('#refreshStatsBtn');

      // Show loading state
      refreshBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i>');
      summary.html('<i class="fas fa-spinner fa-spin text-purple-500"></i> Loading...');

      try {
        const response = await fetch('/api/stats?days=7', { headers: { 'Authorization': 'Bearer ' + authToken } });
        const result = await response.json();

        if (result.success && result.data.enabled) {
          // Redis configured
          if (result.data.summary.total === 0) {
            // No data - show empty state
            empty.removeClass('hidden');
            emptyText.text('Request stats will be recorded automatically.');
            content.addClass('hidden');
            summary.text('No data');
          } else {
            // Data available - show charts
            empty.addClass('hidden');
            content.removeClass('hidden');
            summary.text('Total ' + result.data.summary.total + ' requests');
            renderCharts(result.data);
          }
          if (showToastMsg) showToast('Stats refreshed', 'info');
          // Load login history
          loadLoginRecords();
        } else {
          // Redis not configured - show empty state + hint
          empty.removeClass('hidden');
          emptyText.html('<span class="text-red-400">Redis is not configured. Please set environment variables in Cloudflare.</span>');
          content.addClass('hidden');
          summary.html('<span class="text-red-400">Disabled</span>');
        }
      } catch (e) {
        empty.removeClass('hidden');
        emptyText.html('<span class="text-red-400">Failed to load: ' + e.message + '</span>');
        content.addClass('hidden');
        summary.html('<span class="text-red-400">Error</span>');
      } finally {
        isLoadingStats = false;
        refreshBtn.prop('disabled', false).html('<i class="fas fa-sync-alt"></i>');
      }
    }

    // Start auto-refresh for stats (30s)
    function startStatsAutoRefresh() {
      stopStatsAutoRefresh();
      statsAutoRefreshTimer = setInterval(() => {
        loadStats(false); // Auto-refresh doesn't show toast
      }, 30000);
    }

    function stopStatsAutoRefresh() {
      if (statsAutoRefreshTimer) {
        clearInterval(statsAutoRefreshTimer);
        statsAutoRefreshTimer = null;
      }
    }

    // Load login history
    async function loadLoginRecords() {
      try {
        const response = await fetch('/api/logins?limit=10', { headers: { 'Authorization': 'Bearer ' + authToken } });
        const result = await response.json();
        if (result.success && result.data.length > 0) {
          const html = result.data.map(r => {
            const time = new Date(r.time);
            const timeStr = time.toLocaleString('en-US') + ' ' + time.toLocaleTimeString('en-US');
            return '<div class="flex justify-between items-center py-1 px-2 bg-gray-50 rounded"><span class="text-gray-600">' + timeStr + '</span><span class="text-purple-600 font-mono">' + r.ip + '</span></div>';
          }).join('');
          $('#loginRecordsList').html(html);
        } else {
          $('#loginRecordsList').html('<div class="text-gray-400 text-center py-4">No login history</div>');
        }
      } catch {
        $('#loginRecordsList').html('<div class="text-red-400 text-center py-4">Failed to load</div>');
      }
    }

    function renderEmptyCharts() {
      const emptyData = {
        daily: Array(7).fill(0).map((_, i) => {
          const d = new Date(); d.setDate(d.getDate() - 6 + i);
          return { date: d.toISOString().split('T')[0], total: 0, success: 0, error: 0 };
        }),
        hourly: Array(24).fill(0).map((_, i) => {
          const d = new Date(); d.setHours(d.getHours() - 23 + i);
          return { hour: d.getHours() + ':00', total: 0 };
        }),
        topUrls: {},
        topKeys: {},
        summary: { total: 0, success: 0, error: 0 }
      };
      renderCharts(emptyData);
    }

    function renderCharts(data) {
      // Update summary
      $('#statsSummary').text('Total: ' + data.summary.total + ' | Success: ' + data.summary.success + ' | Error: ' + data.summary.error);

      // Daily Chart
      const dailyCtx = document.getElementById('dailyChart').getContext('2d');
      if (dailyChart) dailyChart.destroy();
      dailyChart = new Chart(dailyCtx, {
        type: 'bar',
        data: {
          labels: data.daily.map(d => d.date.substring(5)),
          datasets: [{
            label: 'Success',
            data: data.daily.map(d => d.success),
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderRadius: 4,
          }, {
            label: 'Error',
            data: data.daily.map(d => d.error),
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderRadius: 4,
          }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } } }
      });

      // Hourly Chart
      const hourlyCtx = document.getElementById('hourlyChart').getContext('2d');
      if (hourlyChart) hourlyChart.destroy();
      hourlyChart = new Chart(hourlyCtx, {
        type: 'line',
        data: {
          labels: data.hourly.map(h => h.hour.split('-').slice(2).join(':')),
          datasets: [{ label: 'Requests', data: data.hourly.map(h => h.total), borderColor: '#667eea', backgroundColor: 'rgba(102, 126, 234, 0.1)', fill: true, tension: 0.3 }]
        },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
      });

      // URL Pie Chart
      const urlCtx = document.getElementById('urlPieChart').getContext('2d');
      if (urlPieChart) urlPieChart.destroy();
      const urlEntries = Object.entries(data.topUrls).sort((a, b) => b[1] - a[1]).slice(0, 5);
      if (urlEntries.length > 0) {
        urlPieChart = new Chart(urlCtx, {
          type: 'doughnut',
          data: {
            labels: urlEntries.map(e => e[0].replace(/https?:\\/\\//, '').substring(0, 20)),
            datasets: [{ data: urlEntries.map(e => e[1]), backgroundColor: ['#667eea', '#764ba2', '#10b981', '#f59e0b', '#ef4444'] }]
          },
          options: { responsive: true, plugins: { legend: { position: 'right', labels: { boxWidth: 12, font: { size: 10 } } } } }
        });
      }

      // Key Rank List
      const keyEntries = Object.entries(data.topKeys).sort((a, b) => b[1] - a[1]).slice(0, 10);
      if (keyEntries.length > 0) {
        $('#keyRankList').html(keyEntries.map((e, i) => '<div class=\"flex justify-between items-center py-1 px-2 bg-gray-50 rounded text-xs\"><span class=\"font-mono text-purple-600\">' + (i+1) + '. ' + e[0] + '</span><span class=\"text-gray-500\">' + e[1] + ' times</span></div>').join(''));
      } else {
        $('#keyRankList').html('<div class=\"text-xs text-gray-400 text-center py-4\">No data</div>');
      }

      // IP Rank List (with block button)
      const ipEntries = Object.entries(data.topIps || {}).sort((a, b) => b[1] - a[1]).slice(0, 10);
      if (ipEntries.length > 0) {
        $('#ipRankList').html(ipEntries.map((e, i) => '<div class=\"flex justify-between items-center py-1 px-2 bg-gray-50 rounded\"><span class=\"font-mono text-blue-600\">' + (i+1) + '. ' + e[0] + '</span><div class=\"flex items-center gap-1\"><span class=\"text-gray-500\">' + e[1] + '</span><button class=\"text-red-400 hover:text-red-600 block-ip-btn\" data-ip=\"' + e[0] + '\" title=\"Block\"><i class=\"fas fa-ban\"></i></button></div></div>').join(''));
      } else {
        $('#ipRankList').html('<div class=\"text-xs text-gray-400 text-center py-4\">No data</div>');
      }
    }

    async function checkSystemStatus() {
      try {
        const response = await fetch('/api/status', { headers: { 'Authorization': 'Bearer ' + authToken } });
        const result = await response.json();
        if (result.success) { isDatabaseMode = result.database_configured && result.database_connected; updateStorageModeUI(result); }
        else { updateStorageModeUI({ storage_mode: 'passthrough', database_configured: false, database_connected: false }); }
      } catch (error) { updateStorageModeUI({ storage_mode: 'passthrough', database_configured: false, database_connected: false, database_error: error.message }); }
    }

    async function testRedis() {
      try {
        const response = await fetch('/api/redis/test', { headers: { 'Authorization': 'Bearer ' + authToken } });
        const result = await response.json();
        updateRedisUI(result);
      } catch (error) { updateRedisUI({ success: false, configured: false, error: error.message }); }
    }

    function updateRedisUI(status) {
      const statusText = $('#redisStatus');
      const icon = $('#redisIcon');
      const hint = $('#redisStatusText');
      if (status.success && status.connected) {
        statusText.text('Connected').removeClass('text-gray-800 text-yellow-600').addClass('text-green-600');
        icon.removeClass('bg-gray-100 bg-yellow-100').addClass('bg-green-100').html('<i class="fas fa-bolt text-green-600 text-xl"></i>');
        hint.html('<i class="fas fa-check-circle text-green-500 mr-1"></i>Redis is working');
      } else if (status.configured && !status.connected) {
        statusText.text('Connection Failed').removeClass('text-gray-800 text-green-600').addClass('text-yellow-600');
        icon.removeClass('bg-gray-100 bg-green-100').addClass('bg-yellow-100').html('<i class="fas fa-exclamation-triangle text-yellow-600 text-xl"></i>');
        hint.html('<i class="fas fa-times-circle text-red-500 mr-1"></i>' + (status.error || 'Connection failed'));
      } else {
        statusText.text('Not Configured').removeClass('text-green-600 text-yellow-600').addClass('text-gray-800');
        icon.removeClass('bg-green-100 bg-yellow-100').addClass('bg-gray-100').html('<i class="fas fa-bolt text-gray-400 text-xl"></i>');
        hint.html('<i class="fas fa-info-circle text-blue-500 mr-1"></i>Redis not configured');
      }
    }

    function updateStorageModeUI(status) {
      const modeText = $('#storageMode');
      const modeIcon = $('#storageModeIcon');
      const dbStatusText = $('#dbStatusText');
      if (status.database_configured && status.database_connected) {
        modeText.text('Database Mode').removeClass('text-gray-800 text-yellow-600').addClass('text-green-600');
        modeIcon.removeClass('bg-gray-100 bg-yellow-100').addClass('bg-green-100').html('<i class="fas fa-database text-green-600 text-2xl"></i>');
        dbStatusText.html('<i class="fas fa-check-circle text-green-500 mr-1"></i>Supabase Connected');
        setDatabaseModeEnabled(true);
      } else if (status.database_configured && !status.database_connected) {
        modeText.text('Database Mode').removeClass('text-gray-800 text-green-600').addClass('text-yellow-600');
        modeIcon.removeClass('bg-gray-100 bg-green-100').addClass('bg-yellow-100').html('<i class="fas fa-exclamation-triangle text-yellow-600 text-2xl"></i>');
        dbStatusText.html('<i class="fas fa-times-circle text-red-500 mr-1"></i>Connection failed: ' + (status.database_error || 'Unknown error'));
        setDatabaseModeEnabled(false);
      } else {
        modeText.text('Passthrough Mode').removeClass('text-green-600 text-yellow-600').addClass('text-gray-800');
        modeIcon.removeClass('bg-green-100 bg-yellow-100').addClass('bg-gray-100').html('<i class="fas fa-bolt text-gray-600 text-2xl"></i>');
        dbStatusText.html('<i class="fas fa-info-circle text-blue-500 mr-1"></i>Database not configured, only passthrough is supported');
        setDatabaseModeEnabled(false);
      }
    }

    function setDatabaseModeEnabled(enabled) {
      isDatabaseMode = enabled;
      const addBtn = $('#addBtn');
      const addInputs = $('#newApiUrl, #newToken, #newEnabled');
      if (enabled) { addBtn.prop('disabled', false).removeClass('opacity-50 cursor-not-allowed'); addInputs.prop('disabled', false).removeClass('bg-gray-100'); $('#addConfigNotice').remove(); }
      else { addBtn.prop('disabled', true).addClass('opacity-50 cursor-not-allowed'); addInputs.prop('disabled', true).addClass('bg-gray-100'); if ($('#addConfigNotice').length === 0) { $('#addBtn').after('<p id="addConfigNotice" class="text-xs text-yellow-600 mt-2"><i class="fas fa-info-circle mr-1"></i>Database must be configured to add tokens</p>'); } }
    }

    function showError(msg) { $('#loginError').text(msg).removeClass('hidden'); setTimeout(() => $('#loginError').addClass('hidden'), 3000); }
    function showToast(message, type = 'success') { const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' }; const toast = $('<div class="toast toast-' + type + '"><i class="fas ' + icons[type] + ' mr-2"></i>' + message + '</div>'); $('body').append(toast); setTimeout(() => { toast.fadeOut(300, function() { $(this).remove(); }); }, 3000); }

    // ============ IP Blacklist Management ============
    $(document).on('click', '.block-ip-btn', async function() {
      const ip = $(this).data('ip');
      if (!ip) return;
      const reason = prompt('Enter reason for blocking (optional):', 'Manual block');
      if (reason === null) return; // User cancelled
      try {
        const response = await fetch('/api/blacklist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
          body: JSON.stringify({ ip, reason: reason || 'Manual block' })
        });
        const result = await response.json();
        if (result.success) {
          showToast('IP ' + ip + ' has been blocked', 'success');
          loadStats(false);
        } else {
          showToast('Block failed: ' + result.error, 'error');
        }
      } catch (error) {
        showToast('Request failed: ' + error.message, 'error');
      }
    });

    // Unblock IP
    window.unblockIp = async function(ip) {
      if (!confirm('Are you sure you want to unblock IP ' + ip + '?')) return;
      try {
        const response = await fetch('/api/blacklist/' + encodeURIComponent(ip), {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + authToken }
        });
        const result = await response.json();
        if (result.success) {
          showToast('IP ' + ip + ' has been unblocked', 'success');
          loadBlacklist();
        } else {
          showToast('Unblock failed: ' + result.error, 'error');
        }
      } catch (error) {
        showToast('Request failed: ' + error.message, 'error');
      }
    };

    // Load blacklist
    async function loadBlacklist() {
      try {
        const response = await fetch('/api/blacklist', { headers: { 'Authorization': 'Bearer ' + authToken } });
        const result = await response.json();
        if (result.success && result.data.length > 0) {
          const html = result.data.map(r => {
            const time = r.blocked_at ? new Date(r.blocked_at).toLocaleString('en-US') : '-';
            return '<div class=\"flex justify-between items-center py-1 px-2 bg-red-50 rounded border border-red-200\"><div><span class=\"font-mono text-red-600\">' + r.ip + '</span><span class=\"text-xs text-gray-500 ml-2\">' + (r.reason || '') + '</span></div><div class=\"flex items-center gap-2\"><span class=\"text-xs text-gray-400\">' + time + '</span><button onclick=\"unblockIp(\\'' + r.ip + '\\')\" class=\"text-green-500 hover:text-green-700\" title=\"Unblock\"><i class=\"fas fa-unlock\"></i></button></div></div>';
          }).join('');
          $('#blacklistContent').html(html);
          $('#blacklistCount').text(result.data.length);
        } else {
          $('#blacklistContent').html('<div class=\"text-xs text-gray-400 text-center py-4\">No blocked IPs</div>');
          $('#blacklistCount').text('0');
        }
      } catch {
        $('#blacklistContent').html('<div class=\"text-xs text-red-400 text-center py-4\">Failed to load</div>');
      }
    }
  </script>
</body>
</html>`
}
