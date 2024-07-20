document.getElementById('form-register').addEventListener('submit',async function(event){
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;


    function showMessage(message, isError = false) {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = message;
        messageDiv.classList.remove('hidden');
        messageDiv.style.backgroundColor = isError ? '#f44336' : '#4CAF50';
  
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 1000);
    }


    try{
        const response = await fetch ('http://localhost:3001/api/register',{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({username, email , password}),
            mode: 'cors'
        });

        if(response.ok) {
            
            showMessage('Đăng ký Thành Công');
            setTimeout(() => {
              window.location.href = '/public/login.html';
          }, 1000);
        }else {
            const data = await response.json();
            showMessage('Có Lỗi , Vui Lòng Thử Lại', true);
            console.error('Có Lỗi , Vui Lòng Thử Lại', data.message);
        }
    }catch (error){
        console.error('Error:', error);
    }

})