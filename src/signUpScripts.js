const apiURL = 'http://localhost:8080/';
const baseURL = 'http://localhost:5000/';

// "홈으로" 버튼을 클릭할 때의 동작 설정
document.getElementById('homeButton').addEventListener('click', function() {
  window.location.href = 'mainPage.html'; // 메인 페이지로 이동
});

// 회원가입 양식에 대한 참조 가져오기
const signUpForm = document.getElementById('signupForm');
const loginIdInput = document.getElementById('loginId');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const emailInput = document.getElementById('email');
const usernameInput = document.getElementById('username');

// 회원가입 양식 제출 이벤트 리스너 추가
signUpForm.addEventListener('submit', function(event) {
  event.preventDefault(); // 기본 제출 동작 방지

  // 입력된 데이터 가져오기
  const loginId = loginIdInput.value;
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  const email = emailInput.value;
  const username = usernameInput.value;

  // 서버로 전송할 데이터 객체 생성
  const formData = new URLSearchParams();
  formData.append('loginId', loginId);
  formData.append('password', password);
  formData.append('passwordCheck', confirmPassword);
  formData.append('email', email);
  formData.append('nickname', username);

  // 서버에 데이터를 전송하기 위한 fetch() 요청 보내기
  fetch(apiURL + 'session-login/join', {
    method: 'POST',
    headers: {
        // @ModelAttribute를 사용했기 때문에 json형태로 전송 X
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    alert(data.resultString)
    if(data.isSuccess){
        window.location.href=baseURL+"loginPage.html";
    }

  })
  .catch(error => {
    console.error('회원가입 실패:', error);
    // 회원가입이 실패한 경우 에러 메시지를 출력하거나 사용자에게 알릴 수 있습니다.
  });
});
