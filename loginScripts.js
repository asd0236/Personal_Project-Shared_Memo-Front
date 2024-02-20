// "홈으로" 버튼을 클릭할 때의 동작 설정
document.getElementById('homeButton').addEventListener('click', function() {
    window.location.href = 'mainPage.html'; // 메인 페이지로 이동
});


// 로그인 폼을 제출할 때의 동작 설정
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 폼의 기본 동작을 막음
    // 사용자명과 비밀번호를 가져옴
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // 로그인 처리를 수행하는 함수 호출
    login(username, password);
});

// 로그인 처리 함수
function login(username, password) {
    
}

// 포스트 데이터를 서버로부터 받아오는 함수 호출
fetchPosts();

// 포스트 데이터를 서버로부터 받아와서 페이지에 추가하는 함수
function fetchPosts() {
    // 서버로부터 포스트 데이터를 받아오는 비동기 요청
    fetch('/posts')
        .then(response => response.json())
        .then(postsData => {
            // 받아온 포스트 데이터를 페이지에 추가하는 함수 호출
            addPostsToPage(postsData);
        })
        .catch(error => console.error('포스트를 가져오는 중 오류 발생:', error));
}

// 포스트 데이터를 페이지에 추가하는 함수
function addPostsToPage(postsData) {
    // 여기에 포스트 데이터를 페이지에 추가하는 코드를 작성
}


