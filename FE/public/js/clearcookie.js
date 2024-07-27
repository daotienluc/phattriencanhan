window.addEventListener('pageshow', (event) => {
    if (event.persisted ||performance.getEntriesByType('navigation').map(nav => nav.type).includes('back_forward')) {

      document.cookie.split(";").forEach((c) => {
        document.cookie = c.trim().split("=")[0] + "=;expires=" + new Date(0).toUTCString() + ";path=/";
      });

      window.location.href = '/public/index.html';
    }
  });
  