function sendDoubt() {
  const input = document.getElementById("doubtInput");
  const chatbox = document.getElementById("chatbox");

  if (input.value.trim() === "") return;

  // Add user message
  let userMsg = document.createElement("div");
  userMsg.className = "message user-message";
  userMsg.style.marginBottom = "8px";
  userMsg.innerHTML = `<strong>You:</strong> ${input.value} <span class="timestamp">${new Date().toLocaleTimeString()}</span>`;
  chatbox.appendChild(userMsg);

  // Simulate typing animation for AI response
  let aiMsg = document.createElement("div");
  aiMsg.className = "message ai-message";
  aiMsg.style.marginBottom = "16px";
  aiMsg.innerHTML = `<strong>AI:</strong> <span class="typing">Typing...</span> <span class="timestamp">${new Date().toLocaleTimeString()}</span>`;
  chatbox.appendChild(aiMsg);

  chatbox.scrollTop = chatbox.scrollHeight;

  // Fetch AI response from backend
  fetch(`http://127.0.0.1:8000/api/doubt/?q=${encodeURIComponent(input.value)}`)
    .then(res => res.json())
    .then(data => {
      // Add a delay before showing the answer
      setTimeout(() => {
        aiMsg.innerHTML = `<strong>AI:</strong> ${data.answer ? data.answer : "Sorry, I couldn't find an answer."} <span class="timestamp">${new Date().toLocaleTimeString()}</span>`;
        chatbox.scrollTop = chatbox.scrollHeight;
      }, 1500);
    })
    .catch(() => {
      setTimeout(() => {
        aiMsg.innerHTML = `<strong>AI:</strong> Sorry, there was an error connecting to the server. <span class="timestamp">${new Date().toLocaleTimeString()}</span>`;
        chatbox.scrollTop = chatbox.scrollHeight;
      }, 1500);
    });

  // Clear input and focus for next message
  input.value = "";
  input.focus();
}

// Theme toggle functionality
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-theme");
  const icon = themeToggle.querySelector("i");
  if (body.classList.contains("dark-theme")) {
    icon.className = "fas fa-sun";
  } else {
    icon.className = "fas fa-moon";
  }
});
// Schedule
function showSchedule() {
  const output = document.getElementById("schedule-output");
  if (output) output.innerHTML = "<em>Loading...</em>";
  fetch("http://127.0.0.1:8000/api/schedule/")
    .then(res => res.json())
    .then(data => {
      if (output) {
        if (data.schedule && data.schedule.length > 0) {
          let html = '<ul class="schedule-list">';
          data.schedule.forEach(item => {
            html += `<li><strong>${item.date.split('T')[0]}</strong>: ${item.subject} - ${item.topic}</li>`;
          });
          html += '</ul>';
  // ...existing code...
  // Prevent form submit reload for doubt input (ensure sendDoubt is defined first)
  window.addEventListener("DOMContentLoaded", function() {
    const doubtInput = document.getElementById("doubtInput");
    if (doubtInput) {
      doubtInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
          e.preventDefault();
          sendDoubt();
        }
      });
    }
  });
          output.innerHTML = html;
        } else {
          output.innerHTML = "<em>No schedule found.</em>";
        }
      }
    })
    .catch(() => {
      if (output) output.innerHTML = "<em>Error loading schedule.</em>";
    });
}

// Quiz
function showQuiz() {
  const form = document.getElementById("quiz-form");
  const resultDiv = document.getElementById("quiz-result");
  if (form) {
    form.style.display = "block";
    form.innerHTML = "<em>Loading...</em>";
    resultDiv.innerHTML = "";
  }
  fetch("http://127.0.0.1:8000/api/quiz/")
    .then(res => res.json())
    .then(data => {
      if (form) {
        if (data.quiz && data.quiz.length > 0) {
          let html = '<ol class="quiz-list">';
          data.quiz.forEach((q, idx) => {
            html += `<li><strong>Q${idx+1}:</strong> ${q.question}<ul>`;
            q.options.forEach((opt, oidx) => {
              html += `<li><label><input type="radio" name="q${idx}" value="${String.fromCharCode(65+oidx)}"> ${opt}</label></li>`;
            });
            html += '</ul></li>';
          });
          html += '</ol>';
          html += '<button type="button" onclick="submitQuiz()">Submit Quiz</button>';
          form.innerHTML = html;
        } else {
          form.innerHTML = "<em>No quiz found.</em>";
        }
      }
    })
    .catch(() => {
      if (form) form.innerHTML = "<em>Error loading quiz.</em>";
    });
}

function submitQuiz() {
  const form = document.getElementById("quiz-form");
  const resultDiv = document.getElementById("quiz-result");
  const radios = form.querySelectorAll('input[type="radio"]:checked');
  let answers = [];
  radios.forEach(radio => {
    answers.push(radio.value);
  });
  fetch("http://127.0.0.1:8000/api/quiz/validate/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({answers: answers})
  })
    .then(res => res.json())
    .then(data => {
      if (resultDiv) {
        resultDiv.innerHTML = `<strong>Your Score:</strong> ${data.score} / ${data.total}`;
      }
    })
    .catch(() => {
      if (resultDiv) resultDiv.innerHTML = "<em>Error submitting quiz.</em>";
    });
}

// ...existing code...