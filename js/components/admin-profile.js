(function() {
  const container = document.getElementById('component-admin-profile');
  if (!container) return;

  container.outerHTML = `
  <!-- Panel 3: Admin Profile Settings -->
  <div id="tab-panel-profile" class="hidden space-y-6">
    <div class="max-w-3xl mx-auto w-full bg-surface-elevated border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
      <div class="mb-5 pb-4 border-b border-neutral-200 dark:border-neutral-800 text-left">
        <h2 class="text-base font-extrabold text-neutral-900 dark:text-white">Admin Profile Settings</h2>
        <p class="text-xs text-neutral-500">Modify your administrative details and portal profile avatar.</p>
      </div>

      <div id="admin-profile-success-msg" class="hidden p-3 rounded-lg border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-semibold text-left">
        Admin details updated successfully!
      </div>

      <form id="admin-profile-edit-form" class="space-y-4 text-xs text-left">
        
        <div class="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-lg bg-surface-secondary/50 border border-neutral-200 dark:border-neutral-800">
          <!-- Avatar Preview Container -->
          <div id="admin-profile-preview-container" class="w-16 h-16 rounded-full border border-neutral-300 dark:border-neutral-700 bg-surface-primary flex items-center justify-center font-mono font-bold text-lg text-neutral-400 overflow-hidden shrink-0">
            A
          </div>
          
          <div class="flex-1 w-full space-y-2">
            <label class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Profile Photo Upload</label>
            <input type="file" id="admin-profile-pic-file" accept="image/*"
              class="w-full text-xs text-neutral-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer">
            <!-- Hidden input to store base64 string -->
            <input type="hidden" id="admin-profile-pic-data">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="admin-profile-name" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Admin Display Name</label>
            <input type="text" id="admin-profile-name" required
              class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          </div>
          <div>
            <label for="admin-profile-email" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Email Address (Read-only)</label>
            <input type="email" id="admin-profile-email" readonly
              class="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 cursor-not-allowed">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="admin-profile-contact" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Contact Number</label>
            <input type="text" id="admin-profile-contact" placeholder="9876543210"
              class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          </div>
          <div>
            <label for="admin-profile-dob" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Date of Birth</label>
            <input type="date" id="admin-profile-dob"
              class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          </div>
        </div>

        <div>
          <label for="admin-profile-address" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Office / Personal Address</label>
          <input type="text" id="admin-profile-address" placeholder="123 Admin Wing, Academic Block"
            class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="admin-profile-college" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">College / Institute</label>
            <input type="text" id="admin-profile-college" placeholder="IIT Bangalore"
              class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          </div>
          <div>
            <label for="admin-profile-degree" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Degree / Position</label>
            <input type="text" id="admin-profile-degree" placeholder="Dean of Academics"
              class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="admin-profile-branch" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Department / Branch</label>
            <input type="text" id="admin-profile-branch" placeholder="Computer Science"
              class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          </div>
          <div>
            <label for="admin-profile-specialization" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Specialization</label>
            <input type="text" id="admin-profile-specialization" placeholder="Information Security"
              class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
          </div>
        </div>

        <div class="pt-2">
          <button type="submit"
            class="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-colors">
            Save Admin Profile
          </button>
        </div>
      </form>
    </div>
  </div>`;
})();
