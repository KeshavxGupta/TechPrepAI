(function() {
  const container = document.getElementById('component-user-profile');
  if (!container) return;

  container.outerHTML = `
  <!-- Panel 3: Profile Settings -->
  <div id="tab-panel-profile" class="hidden space-y-6">
    <div class="max-w-4xl mx-auto w-full bg-surface-elevated border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
      
      <!-- Header & Profile Status Grid -->
      <div class="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 gap-4">
        <div class="text-left">
          <h2 class="text-base font-extrabold text-neutral-900 dark:text-white">Profile Settings & Credentials</h2>
          <p class="text-xs text-neutral-500">Add detailed contact, academic, and external coding profiles to complete setup.</p>
        </div>
        
        <!-- Completeness status widgets -->
        <div class="w-full md:w-64 space-y-2">
          <div class="flex items-center justify-between text-xs font-semibold">
            <span class="text-neutral-500">Profile Completion</span>
            <span id="completeness-percentage" class="text-blue-600 dark:text-blue-400 font-mono">0%</span>
          </div>
          <div class="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
            <div id="completeness-bar" class="bg-blue-600 h-2 rounded-full transition-all duration-500" style="width: 0%"></div>
          </div>
        </div>
      </div>

      <!-- Incomplete Warnings Notification -->
      <div id="profile-warning-alert" class="hidden p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-left">
        <div class="flex items-center space-x-2 text-amber-600 dark:text-amber-500 font-bold mb-1.5 uppercase font-mono tracking-wider">
          <span>INCOMPLETE PROFILE STATE</span>
        </div>
        <p class="text-neutral-600 dark:text-neutral-400 mb-1 leading-relaxed">Please complete all profile details to remove warnings. Missing fields:</p>
        <p id="profile-missing-fields" class="font-mono text-[10px] text-neutral-500 leading-normal"></p>
      </div>

      <div id="profile-success-msg" class="hidden p-3 rounded-lg border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-semibold text-left">
        Profile details updated successfully!
      </div>

      <form id="profile-edit-form" class="space-y-6 text-xs text-left">
        
        <!-- SECTION 1: Personal Profile & Avatar -->
        <div class="space-y-4">
          <h3 class="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">1. Personal & Basic Information</h3>
          
          <div class="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-lg bg-surface-secondary/50 border border-neutral-200 dark:border-neutral-800">
            <!-- Avatar Preview Container -->
            <div id="profile-preview-container" class="w-16 h-16 rounded-full border border-neutral-300 dark:border-neutral-700 bg-surface-primary flex items-center justify-center font-mono font-bold text-lg text-neutral-400 overflow-hidden shrink-0">
              P
            </div>
            
            <div class="flex-1 w-full space-y-3">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-neutral-500 font-medium mb-1">Profile Photo Upload</label>
                  <input type="file" id="profile-pic-file" accept="image/*"
                    class="w-full text-[10px] text-neutral-500 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer">
                </div>
                <div>
                  <label for="profile-pic-url" class="block text-neutral-500 font-medium mb-1">Or Photo URL</label>
                  <input type="url" id="profile-pic-url" placeholder="https://unsplash.com/photos/..."
                    class="w-full p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500">
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label for="profile-name" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Full Name</label>
              <input type="text" id="profile-name" required
                class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            </div>

            <div>
              <label for="profile-email" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Email Address</label>
              <input type="email" id="profile-email" required
                class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            </div>

            <div>
              <label for="profile-contact" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Contact Number</label>
              <input type="tel" id="profile-contact" placeholder="e.g. 9876543210"
                class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            </div>

            <div>
              <label for="profile-dob" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Date of Birth</label>
              <input type="date" id="profile-dob"
                class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            </div>

            <div class="sm:col-span-2">
              <label for="profile-address" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Home Address</label>
              <input type="text" id="profile-address" placeholder="e.g. 12, MG Road, Bangalore"
                class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            </div>
          </div>
        </div>

        <!-- SECTION 2: Academic Credentials -->
        <div class="space-y-4 pt-2">
          <h3 class="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">2. Education & Academic Scores</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="sm:col-span-2">
              <label for="profile-college" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">College Name</label>
              <input type="text" id="profile-college" placeholder="e.g. National Institute of Technology"
                class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            </div>

            <div>
              <label for="profile-degree" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Degree / Course</label>
              <input type="text" id="profile-degree" placeholder="e.g. B.Tech / BCA"
                class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            </div>

            <div>
              <label for="profile-branch" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Branch / Major</label>
              <input type="text" id="profile-branch" placeholder="e.g. Computer Science Engineering"
                class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            </div>

            <div>
              <label for="profile-specialization" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Specialization</label>
              <input type="text" id="profile-specialization" placeholder="e.g. Artificial Intelligence / Cloud"
                class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            </div>

            <div>
              <label for="profile-grad-year" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Graduation Year</label>
              <input type="number" id="profile-grad-year" placeholder="e.g. 2026"
                class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            </div>

            <div>
              <label for="profile-cgpa" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Current CGPA</label>
              <input type="number" id="profile-cgpa" step="0.01" min="0" max="10" placeholder="e.g. 8.75"
                class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            </div>

            <div>
              <label for="profile-marks10" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">10th Score (%)</label>
              <input type="number" id="profile-marks10" step="0.1" min="0" max="100" placeholder="e.g. 92.5"
                class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            </div>

            <div>
              <label for="profile-marks12" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">12th Score (%)</label>
              <input type="number" id="profile-marks12" step="0.1" min="0" max="100" placeholder="e.g. 89.2"
                class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            </div>
          </div>
        </div>

        <!-- SECTION 3: Skills & Profiles -->
        <div class="space-y-4 pt-2">
          <h3 class="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">3. Technical Skills & Social Links</h3>
          
          <div class="space-y-3">
            <div>
              <label for="profile-skills" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Technical Skills (comma-separated list)</label>
              <input type="text" id="profile-skills" placeholder="e.g. Data Structures, Algorithms, Python, React"
                class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="profile-leetcode" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Coding Profile URL</label>
                <input type="url" id="profile-leetcode" placeholder="https://codingplatform.com/username"
                  class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
              </div>

              <div>
                <label for="profile-github" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">GitHub Profile URL</label>
                <input type="url" id="profile-github" placeholder="https://github.com/username"
                  class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
              </div>

              <div>
                <label for="profile-linkedin" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">LinkedIn Profile URL</label>
                <input type="url" id="profile-linkedin" placeholder="https://linkedin.com/in/username"
                  class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
              </div>

              <div>
                <label for="profile-portfolio" class="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Personal Portfolio URL</label>
                <input type="url" id="profile-portfolio" placeholder="https://mywebsite.com"
                  class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
              </div>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <button type="submit"
            class="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-colors font-sans text-xs">
            Save Profile Details
          </button>
        </div>
      </form>
    </div>
  </div>`;
})();



