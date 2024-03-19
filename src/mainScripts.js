const apiURL = "http://localhost:8080/";
const baseURL = "http://localhost:5000/";

/***************************************************

로그인 정보 가져오기 -> 메인 화면 구성

***************************************************/

// 페이지 로드 시 로그인 상태 확인
var isLogin = false;

// GET
fetch(apiURL + "session-login/info", {
  credentials: "include",
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    if (data.memberId != null) {
      isLogin = true;
      updateNotebookName(isLogin);
      updateSignButton(isLogin);
    }
  })
  .catch((error) => {
    console.error("정보 조회 실패:", error);
  });

function updateNotebookName(isLogin) {
  var notebookNameElement = document.getElementById("notebookName");
  notebookNameElement.textContent = isLogin
    ? "로그인 완료"
    : "우리 공유 메모장";
}

function updateSignButton(isLogin) {
  var signButton = document.getElementById("signButton");
  if (isLogin) {
    signButton.textContent = "로그아웃";
  } else {
    signButton.textContent = "로그인";
  }
}

// "로그인 or 로그아웃" 버튼을 클릭할 때의 동작 설정
var signButton = document.getElementById("signButton");

signButton.addEventListener("click", function () {
  if (isLogin == false)
    // 로그인중일 경우
    window.location.href = "loginPage.html"; // 로그인 페이지로 이동
  else {
    // 로그인중이 아닐 경우
    fetch(apiURL + "session-login/logout", {
      credentials: "include",
    })
      .then(() => {
        alert("로그아웃이 완료되었습니다.");
        isLogin = false;
        updateNotebookName(isLogin);
        updateSignButton(isLogin);
        window.location.href = "mainPage.html";
      })
      .catch((error) => {
        console.error("로그아웃 실패:", error);
      });
  }
});

/***************************************************

노트북 가져오기

***************************************************/

// 노트북 목록 추가
function addNotebooksToPage(notebooks) {
  const notebookList = document.getElementById("notebookList"); // 노트북 목록 ul 요소 가져오기

  notebooks.forEach((notebook) => {
    const notebookElement = document.createElement("li");
    const notebookLink = document.createElement("a");
    notebookLink.textContent = notebook.name;
    notebookLink.href = "#"; // 클릭 시 페이지 이동 방지
    notebookLink.dataset.notebookId = notebook.notebookId; // 노트북 ID 설정
    notebookElement.appendChild(notebookLink);
    notebookList.appendChild(notebookElement); // 생성된 노트북을 ul 요소에 추가
  });
}

// 페이지 초기화 시나 새 노트북 추가 후에 노트북 목록을 불러오는 함수
function loadNotebooks() {
  fetch(apiURL + "notebook", {
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      addNotebooksToPage(data);
      // 노트북이 로드된 후에 새 노트북 추가 옵션을 추가
      addNewNotebookOption();
    })
    .catch((error) => {
      console.error("노트북 목록 불러오기 실패:", error);
    });
}

/***************************************************

노트북 추가

***************************************************/

function addNewNotebookOption() {
  const notebookList = document.getElementById("notebookList");
  const addNotebookElement = document.createElement("li");
  addNotebookElement.textContent = "+ 노트북 추가";
  addNotebookElement.id = "addNotebook";
  notebookList.appendChild(addNotebookElement);

  // 이 새 요소에 클릭 이벤트 리스너 추가
  addNotebookElement.addEventListener("click", function () {
    openAddNotebookModal();
  });
}

// 새 노트북 이름을 입력받기 위한 모달 혹은 입력 필드를 표시하는 함수
function openAddNotebookModal() {
  // UI 디자인 방식에 따라 다르게 구현할 수 있습니다,
  // 여기서는 간단한 프롬프트 또는 사용자 정의 모달을 생성할 수 있습니다
  const notebookName = prompt("노트북 이름을 입력하세요:");
  if (notebookName) {
    createNewNotebook(notebookName);
  }
}

function createNewNotebook(notebookName) {
  const formData = new URLSearchParams();
  formData.append("notebookName", notebookName);

  fetch(apiURL + "notebook/add", {
    method: "POST",
    headers: {
      // @ModelAttribute를 사용했기 때문에 json형태로 전송 X
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("노트북 추가 완료:", data);
      loadNotebooks(); // 새로운 노트북을 포함하여 노트북 목록을 다시 불러옴
    })
    .catch((error) => {
      console.error("노트북 추가 실패:", error);
    });
}

// 페이지 로드 시
window.addEventListener("load", loadNotebooks);

/***************************************************

노트북 클릭 -> 메모 가져오기

***************************************************/

// 노트북을 클릭할 때 메모들을 가져와서 페이지에 추가하는 함수
function loadMemosByNotebook(notebookId) {
  const postsContainer = document.getElementById("posts");
  postsContainer.innerHTML = ""; // 이전에 추가된 메모들을 모두 제거

  fetch(apiURL + "memo/" + notebookId, {
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      data.forEach((memo) => {
        const memoElement = document.createElement("article");
        memoElement.classList.add("memo");

        const memoContentElement = document.createElement("div");
        memoContentElement.classList.add("memo-content");
        memoContentElement.innerHTML = `
                <h2>${memo.title}</h2>
                <p>${truncateText(memo.content)}</p>
                <p>${memo.createDate}</p>
            `;

        // 클릭 시 전체 내용을 보여주는 모달 창 열기
        memoContentElement.addEventListener("click", function () {
          openModal(memo.content);
        });

        memoElement.appendChild(memoContentElement);

        postsContainer.appendChild(memoElement); // 메모를 페이지에 추가
      });
      addMemo(notebookId);
    })
    .catch((error) => {
      console.error("메모 가져오기 실패:", error);
    });
}

// 텍스트가 일정 길이를 넘어가면 생략하고 '...'을 붙이는 함수
function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}

// 모달 창 열기
function openModal(content) {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  modalContent.innerHTML = `
        <span class="close-modal">&times;</span>
        <p>${content}</p>
    `;
  modal.appendChild(modalContent);

  // 모달 창 닫기 버튼
  const closeModal = modalContent.querySelector(".close-modal");
  closeModal.addEventListener("click", function () {
    modal.remove();
  });

  document.body.appendChild(modal);
}

// 노트북을 클릭할 때 마다 메모들을 가져와서 페이지에 추가하는 이벤트 리스너 설정
document.addEventListener("click", function (event) {
  const target = event.target;
  if (target.tagName === "A" && target.closest("#notebookList")) {
    event.preventDefault(); // 기본 동작 방지

    const notebookId = target.dataset.notebookId; // 클릭한 노트북의 ID 가져오기
    loadMemosByNotebook(notebookId); // 해당 노트북의 메모들을 페이지에 추가
  }
});

/***************************************************

메모 추가

***************************************************/

function addMemo(notebookId) {
  const postsContainer = document.getElementById("posts");

  const memoElement = document.createElement("article");

  memoElement.classList.add("memo");

  const memoContentElement = document.createElement("div");
  memoContentElement.classList.add("memo-content");
  memoContentElement.innerHTML = `
                <h2>+ 메모 추가하기</h2>
            `;

  // 클릭 시 전체 내용을 보여주는 모달 창 열기
  memoContentElement.addEventListener("click", function () {
    openAddMemoModal(notebookId);
  });

  memoElement.appendChild(memoContentElement);

  postsContainer.appendChild(memoElement); // 메모를 페이지에 추가
}

// 메모 추가 모달
function openAddMemoModal(notebookId) {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  modalContent.innerHTML = `
    <span class="close-modal">&times;</span>
    <h2>메모 추가</h2>
    <form id="addMemoForm">
        <label for="memoTitle">제목:</label>
        <input type="text" id="memoTitle" name="memoTitle" required><br><br>
        <label for="memoContent">본문:</label><br>
        <textarea id="memoContent" name="memoContent" required></textarea><br><br>
        <button type="submit">등록</button>
    </form>
    `;
  modal.appendChild(modalContent);

  // 모달 창 닫기 버튼
  const closeModal = modalContent.querySelector(".close-modal");
  closeModal.addEventListener("click", function () {
    modal.remove();
  });

  // 메모 등록 폼
  const addMemoForm = modalContent.querySelector("#addMemoForm");
  addMemoForm.addEventListener("submit", function (event) {
    event.preventDefault(); // 폼 제출 방지

    const memoTitle = document.getElementById("memoTitle").value;
    const memoContent = document.getElementById("memoContent").value;

    // 서버로 전송할 데이터 객체 생성
    const formData = new URLSearchParams();
    formData.append("title", memoTitle);
    formData.append("content", memoContent);

    // 메모 데이터를 서버로 전송
    fetch(apiURL + "memo/add/" + notebookId, {
      method: "POST",
      headers: {
        // @ModelAttribute를 사용했기 때문에 json형태로 전송 X
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        alert("새로운 메모가 추가되었습니다:");
        window.location.href = "mainPage.html";
      })
      .catch((error) => {
        alert("메모 추가를 실패하였습니다.");
        console.error("메모 추가 실패:", error);
      });

    // 모달 닫기
    modal.remove();
  });

  document.body.appendChild(modal);
}

/***************************************************

비로그인 상태일 때 화면 구성

***************************************************/

// 포스트 내용을 담고 있는 배열 (서버에서 받아온 것으로 가정)
const postsData = [
  {
    title: "개발 환경",
    content: `front - vscode(html, css, javascript)<br>
        back - intellij(java17), spring boot(gradle), mariadb 10.6`,
  },
  {
    title: "로그인 인증 방식",
    content: "세션 방식을 사용",
  },
  {
    title: "세션 인증 방식 참고 출처",
    content: `https://chb2005.tistory.com/175<br>
        https://wangmin.tistory.com/46`,
  },
];

// 포스트를 생성하고 페이지에 추가하는 함수
function addPostsToPage() {
  const postsContainer = document.getElementById("posts");

  postsData.forEach((post) => {
    const postElement = document.createElement("article");
    postElement.classList.add("memo");

    const thumbnailElement = document.createElement("div");
    postElement.appendChild(thumbnailElement);

    const postContentElement = document.createElement("div");
    postContentElement.classList.add("memo-content");
    postContentElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
        `;
    postElement.appendChild(postContentElement);

    postsContainer.appendChild(postElement);
  });
}

// 페이지가 로드될 때 포스트를 추가
window.addEventListener("load", addPostsToPage);
