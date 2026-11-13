(function() {
      const currentUser = (typeof sessionStorage !== 'undefined' && JSON.parse(sessionStorage.getItem('techprep_current_user') || 'null'));
      if (currentUser) {
        if (currentUser.email === 'khushboo2006june@admin.com') {
          window.location.href = '../admin/admin-hub.html';
          return;
        } else {
          window.location.href = '../user/dashboard.html';
          return;
        }
      }
      window.location.href = "../../index.html?modal=signup";
    })();
