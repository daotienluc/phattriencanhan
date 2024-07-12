const multipleChoiceQuestions = [
  {
    title: "Bài 1",
    question: "Có bao nhiêu số tự nhiên có 4 chữ số khác nhau đôi một?",
    options: ["A. 5040", "B. 9000", "C. 1000", "D. 4436"],
  },
  {
    title: "Bài 2",
    question:
      "Trong mặt phẳng α cho bốn điểm A, B, C, D trong đó không có ba điểm nào thẳng hàng. Điểm S∉α. Có mấy mặt phẳng tạo bởi S và hai trong bốn điểm nói trên?",
    options: ["A. 6", "B. 4", "C. 5", "D. 8"],
  },
  {
    title: "Bài 3",
    question: "Tứ diện ABCD. Phát biểu nào sau đây đúng?",
    options: [
      "A. Hai đường thẳng AC và BD cắt nhau",
      "B. Hai đường thẳng AC và BD không có điểm chung",
      "C. Tồn tại một mặt phẳng chứa hai đường thẳng AC và BD",
      "D. Không thể vẽ hình biểu diễn tứ diện ABCD bằng các nét liền",
    ],
  },
  {
    title: "Bài 4",
    question: "Mệnh đề nào sau đây sai?",
    options: [
      "A. Phép dời hình là một phép đồng dạng với tỉ số đồng dạng bằng 1",
      "B. Phép dời hình biến đường thẳng thành đường thẳng, biến tia thành tia, biến một đoạn thẳng thành đoạn thẳng có độ dài bằng nó",
      "C. Phép đồng dạng biến một tam giác thành một tam giác bằng nó, biến một đường tròn thành đường tròn có cùng bán kính",
      "D. Phép vị tự tâm O, tỉ số k biến một góc thành một góc có số đo bằng nó",
    ],
  },
];

const essayQuestions = [
  {
    title: "Bài 1",
    question:
      "Cho hình chóp S.ABCD có đáy ABCD là hình thang (hai đáy AB > CD). Gọi M, N lần lượt là trung điểm của SA, SB.",
    options: [
      "a) Tìm giao điểm P của SC và mp (ADN).",
      "",
      "b) Biết AN cắt DP tại I. Chứng minh SI // AB. Tứ giác SABI là hình gì?",
    ],
  },
  {
    title: "Bài 2",
    question: "Giải các phương trình lượng giác:",
    options: [
      "a) \\(\\cos\\left(3x + \\frac{\\pi}{6}\\right) - \\sin\\left(\\frac{\\pi}{3} - 3x\\right) = \\sqrt{3}\\)",
      "",
      "b) \\(\\sin x + \\sin 2x + \\sin 3x = 0\\)",
    ],
  },
  {
    title: "Bài 3",
    question:
      "Tìm hiểu thời gian hoàn thành một bài tập (đơn vị: phút) của một số học sinh thu được kết quả sau:",
    options: [
      `<table>
                <tr>
                    <th>Thời gian (phút)</th>
                    <th>[0; 4)</th>
                    <th>[4; 8)</th>
                    <th>[8; 12)</th>
                    <th>[12; 16)</th>
                    <th>[16; 20)</th>
                </tr>
                <tr>
                    <td>Số học sinh</td>
                    <td>2</td>
                    <td>4</td>
                    <td>7</td>
                    <td>4</td>
                    <td>3</td>
                </tr>
            </table>`,
      "",
      "Hãy cho biết ngưỡng thời gian để xác định 25% học sinh hoàn thành bài tập với thời gian lâu nhất.",
    ],
  },
  {
    title: "Bài 4",
    question:
      "Một hãng taxi áp dụng mức giá đối với khách hàng theo hình thức bậc thang như sau: Mỗi bậc áp dụng cho 10 km. Bậc 1 (áp dụng cho 10 km đầu) có giá trị 10 000 đồng/1 km, giá mỗi km ở các bậc tiếp theo giảm 5% so với giá của bậc trước đó. Bạn An thuê hãng taxi đó để đi quãng đường 114 km, nhưng khi đi được 50 km thì bạn Bình đi chung hết quãng đường còn lại. Tính số tiền mà bạn An phải trả, biết rằng mức giá áp dụng từ lúc xe xuất phát và số tiền trên quãng đường đi chung bạn An chỉ phải trả 20% (Kết quả làm tròn đến hàng nghìn).",
    options: [],
  },
];

function createMultipleChoiceQuestionElement(questionObj) {
  const container = document.createElement("div");
  container.classList.add("question-container");

  const title = document.createElement("div");
  title.classList.add("question-title");
  title.innerText = questionObj.title;

  const question = document.createElement("div");
  question.classList.add("my-3");
  question.innerText = questionObj.question;

  const optionsContainer = document.createElement("div");
  optionsContainer.classList.add("options");

  questionObj.options.forEach((option) => {
    const optionDiv = document.createElement("div");
    optionDiv.classList.add("option");
    optionDiv.innerText = option;
    optionsContainer.appendChild(optionDiv);
  });

  container.appendChild(title);
  container.appendChild(question);
  container.appendChild(optionsContainer);

  return container;
}

function createMultipleChoiceQuestionElement(questionObj) {
  const container = document.createElement("div");
  container.classList.add("question-container");

  const title = document.createElement("div");
  title.classList.add("question-title");
  title.innerText = questionObj.title;

  const question = document.createElement("div");
  question.classList.add("my-3");
  question.innerText = questionObj.question;

  const optionsContainer = document.createElement("div");
  optionsContainer.classList.add("options");

  questionObj.options.forEach((option) => {
    const optionDiv = document.createElement("div");
    optionDiv.classList.add("option");
    optionDiv.innerText = option;
    optionsContainer.appendChild(optionDiv);
  });

  container.appendChild(title);
  container.appendChild(question);
  container.appendChild(optionsContainer);

  return container;
}

function createEssayQuestionElement(questionObj) {
  const container = document.createElement("div");
  container.classList.add("question-container");

  const title = document.createElement("div");
  title.classList.add("question-title");
  title.innerText = questionObj.title;

  const question = document.createElement("div");
  question.classList.add("my-3");
  question.innerHTML = questionObj.question;

  const optionsContainer = document.createElement("div");
  optionsContainer.classList.add("options");

  questionObj.options.forEach((option) => {
    const optionDiv = document.createElement("div");
    optionDiv.classList.add("option");
    optionDiv.innerHTML = option;
    optionsContainer.appendChild(optionDiv);
  });

  container.appendChild(title);
  container.appendChild(question);
  container.appendChild(optionsContainer);

  return container;
}

const questionsContainer = document.getElementById("questions");
multipleChoiceQuestions.forEach((questionObj) => {
  const questionElement = createMultipleChoiceQuestionElement(questionObj);
  questionsContainer.appendChild(questionElement);
});

const essayQuestionsContainer = document.getElementById("essay-questions");
essayQuestions.forEach((questionObj) => {
  const questionElement = createEssayQuestionElement(questionObj);
  essayQuestionsContainer.appendChild(questionElement);
});

// Re-render MathJax after dynamically adding content
window.MathJax.typeset();
