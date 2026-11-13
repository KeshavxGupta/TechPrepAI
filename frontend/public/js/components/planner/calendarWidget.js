/**
 * Interactive Study Planner Calendar Widget
 */
function renderCalendarGrid(containerEl, year, month, tasksByDate = {}) {
  if (!containerEl) return;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let html = '<div class="grid grid-cols-7 gap-1 font-mono text-xs text-center">';
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  dayNames.forEach(d => html += `<div class="font-bold text-neutral-500 py-1">${d}</div>`);

  for (let i = 0; i < firstDay; i++) {
    html += '<div class="p-2"></div>';
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const count = tasksByDate[dateKey] ? tasksByDate[dateKey].length : 0;
    html += `
      <div class="p-2 border rounded border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
        <div class="font-bold">${day}</div>
        ${count > 0 ? `<div class="w-1.5 h-1.5 rounded-full bg-blue-500 mx-auto mt-1"></div>` : ''}
      </div>
    `;
  }

  html += '</div>';
  containerEl.innerHTML = html;
}

window.renderCalendarGrid = renderCalendarGrid;
