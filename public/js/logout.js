document.getElementById('logout').addEventListener('click', async () => {
    try {
      const response = await fetch('http://localhost:3001/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
  
      if (response.ok) {
        alert('Logout successful');
        window.location.href = '/public/index.html'; // Chuyển hướng tới trang đăng nhập
      } else {
        alert('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  });

  