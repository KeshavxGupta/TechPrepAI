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
      const params = new URLSearchParams(window.location.search);
      let url = "../../index.html?modal=login";
      const email = params.get('email');
      const registered = params.get('registered');
      if (email) url += "&email=" + encodeURIComponent(email);
      if (registered) url += "&registered=" + encodeURIComponent(registered);
      window.location.href = url;
    })();
