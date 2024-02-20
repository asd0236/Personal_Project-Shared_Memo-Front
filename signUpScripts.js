// "홈으로" 버튼을 클릭할 때의 동작 설정
document.getElementById('homeButton').addEventListener('click', function() {
    window.location.href = 'mainPage.html'; // 메인 페이지로 이동
});

// 회원가입 데이터를 서버로 전송하는 함수 호출
function signup(username, email, password, confirmPassword) {
    // 회원가입 데이터를 담은 객체 생성
    const formData = {
        username: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword
    };

    // 서버로 회원가입 데이터를 전송하는 비동기 요청
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        // 서버로부터 받은 응답에 따라 동작 수행
        if (data.success) {
            // 회원가입 성공 시 처리
            alert('회원가입이 완료되었습니다.');
            window.location.href = 'login.html'; // 로그인 페이지로 이동
        } else {
            // 회원가입 실패 시 처리
            alert('회원가입에 실패했습니다: ' + data.message);
        }
    })
    .catch(error => console.error('회원가입 요청 중 오류 발생:', error));
}
