var notebookNameElement = document.getElementById('notebookName');
var notebookName = '동적으로 변경될 노트북 이름';
notebookNameElement.textContent = notebookName;

// "로그인" 버튼을 클릭할 때의 동작 설정
document.getElementById('loginButton').addEventListener('click', function() {
    window.location.href = 'loginPage.html'; // 로그인 페이지로 이동
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
        content: "https://chb2005.tistory.com/175"
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

