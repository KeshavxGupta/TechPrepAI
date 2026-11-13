// React presentation; feature controllers attach after the initial mount.
export default function AdminProfile() {
  return (
    <>
      {/* Panel 3: Admin Profile Settings */}
      <div id="tab-panel-profile" className="hidden space-y-6">
        <div className="max-w-3xl mx-auto w-full bg-surface-elevated border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="mb-5 pb-4 border-b border-neutral-200 dark:border-neutral-800 text-left">
            <h2 className="text-base font-extrabold text-neutral-900 dark:text-white">
              Admin Profile Settings
            </h2>
            <p className="text-xs text-neutral-500">
              Modify your administrative details and portal profile avatar.
            </p>
          </div>
          <div
            id="admin-profile-success-msg"
            className="hidden p-3 rounded-lg border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-semibold text-left"
          >
            Admin details updated successfully!
          </div>
          <form id="admin-profile-edit-form" className="space-y-4 text-xs text-left">
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-lg bg-surface-secondary/50 border border-neutral-200 dark:border-neutral-800">
              {/* Avatar Preview Container */}
              <div
                id="admin-profile-preview-container"
                className="w-16 h-16 rounded-full border border-neutral-300 dark:border-neutral-700 bg-surface-primary flex items-center justify-center font-mono font-bold text-lg text-neutral-400 overflow-hidden shrink-0"
              >
                A
              </div>
              <div className="flex-1 w-full space-y-2">
                <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                  Profile Photo Upload
                </label>
                <input
                  type="file"
                  id="admin-profile-pic-file"
                  accept="image/*"
                  className="w-full text-xs text-neutral-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
                {/* Hidden input to store base64 string */}
                <input type="hidden" id="admin-profile-pic-data" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="admin-profile-name"
                  className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1"
                >
                  Admin Display Name
                </label>
                <input
                  type="text"
                  id="admin-profile-name"
                  required
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="admin-profile-email"
                  className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1"
                >
                  Email Address (Read-only)
                </label>
                <input
                  type="email"
                  id="admin-profile-email"
                  readOnly
                  className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="admin-profile-contact"
                  className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1"
                >
                  Contact Number
                </label>
                <input
                  type="text"
                  id="admin-profile-contact"
                  placeholder={9876543210}
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="admin-profile-dob"
                  className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="admin-profile-dob"
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="admin-profile-address"
                className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1"
              >
                Office / Personal Address
              </label>
              <input
                type="text"
                id="admin-profile-address"
                placeholder="123 Admin Wing, Academic Block"
                className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="admin-profile-college"
                  className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1"
                >
                  College / Institute
                </label>
                <input
                  type="text"
                  id="admin-profile-college"
                  placeholder="IIT Bangalore"
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="admin-profile-degree"
                  className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1"
                >
                  Degree / Position
                </label>
                <input
                  type="text"
                  id="admin-profile-degree"
                  placeholder="Dean of Academics"
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="admin-profile-branch"
                  className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1"
                >
                  Department / Branch
                </label>
                <input
                  type="text"
                  id="admin-profile-branch"
                  placeholder="Computer Science"
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="admin-profile-specialization"
                  className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1"
                >
                  Specialization
                </label>
                <input
                  type="text"
                  id="admin-profile-specialization"
                  placeholder="Information Security"
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-colors"
              >
                Save Admin Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
