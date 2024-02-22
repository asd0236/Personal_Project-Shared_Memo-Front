const apiURL = 'http://localhost:8080/';
const baseURL = 'http://localhost:5000/';

// 페이지 로드 시 로그인 상태 확인
var isLogin = false;

// GET
fetch(apiURL + 'session-login/info', {
    credentials: 'include'
})
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.memberId != null) {
            isLogin = true;
            updateNotebookName(isLogin);
            updateSignButton(isLogin);
        }
    })
    .catch(error => {
        console.error('정보 조회 실패:', error);
    });

function updateNotebookName(isLogin) {
    var notebookNameElement = document.getElementById('notebookName');
    notebookNameElement.textContent = isLogin ? '로그인 완료' : '우리 공유 메모장';
}

function updateSignButton(isLogin) {
    var signButton = document.getElementById('signButton');
    if (isLogin) {
        signButton.textContent = '로그아웃';
    } else {
        signButton.textContent = '로그인';
    }
}

// "로그인 or 로그아웃" 버튼을 클릭할 때의 동작 설정
var signButton = document.getElementById('signButton');

signButton.addEventListener('click', function () {
    if (isLogin == false) // 로그인중일 경우
        window.location.href = 'loginPage.html'; // 로그인 페이지로 이동

    else { // 로그인중이 아닐 경우
        fetch(apiURL + 'session-login/logout', {
            credentials: "include"
        })
            .then(() => {
                alert('로그아웃이 완료되었습니다.');
                isLogin = false;
                updateNotebookName(isLogin);
                updateSignButton(isLogin);
                window.location.href = 'mainPage.html';
            })
            .catch(error => {
                console.error('로그아웃 실패:', error);
            });
    }
});

// 포스트 내용을 담고 있는 배열 (서버에서 받아온 것으로 가정)
const postsData = [
    {
        title: "개발 환경",
        content: `front - vscode(html, css, javascript)<br>
        back - intellij(java17), spring boot(gradle), mariadb 10.6`
    },
    {
        title: "로그인 인증 방식",
        content: "세션 방식을 사용"
    },
    {
        title: "세션 인증 방식 참고 출처",
        content: `https://chb2005.tistory.com/175<br>
        https://wangmin.tistory.com/46`
    }

];

// 포스트를 생성하고 페이지에 추가하는 함수
function addPostsToPage() {
    const postsContainer = document.getElementById('posts');

    postsData.forEach(post => {
        const postElement = document.createElement('article');
        postElement.classList.add('post');

        const thumbnailElement = document.createElement('div');
        postElement.appendChild(thumbnailElement);

        const postContentElement = document.createElement('div');
        postContentElement.classList.add('post-content');
        postContentElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
        `;
        postElement.appendChild(postContentElement);

        postsContainer.appendChild(postElement);
    });
}

// 페이지가 로드될 때 포스트를 추가
window.addEventListener('load', addPostsToPage);

