const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxiqydmU36vp4gx3tT4SFJvfk3rgURJ1nMYZJkH77BJDWj-ieG4OaDygU2m0gqJOhuz/exec";

let submissionInProgress = false;

function updateStreakDisplay(name, email) {
  fetch(`${SCRIPT_URL}?email=${encodeURIComponent(email)}&mode=read`)
    .then(res => res.json())
    .then(data => {
      if (data.success && data.streak !== undefined) {
        document.getElementById("streakHeader").textContent = `🔥 You're on a ${data.streak}-day streak!`;
      }
    });
}

function markToday() {
  if (submissionInProgress) return;
  submissionInProgress = true;

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const responseDiv = document.getElementById("response");
  const errorDiv = document.getElementById("error");
  const thankYou = document.getElementById("thankYouMessage");
  const trackerForm = document.getElementById("trackerForm");

  responseDiv.style.display = 'none';
  errorDiv.style.display = 'none';
  thankYou.style.display = 'none';

  if (!name || !email) {
    errorDiv.textContent = "Please fill in both fields.";
    errorDiv.style.display = 'block';
    submissionInProgress = false;
    return;
  }

  localStorage.setItem("streakName", name);
  localStorage.setItem("streakEmail", email);

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  fetch(`${SCRIPT_URL}?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&timezone=${encodeURIComponent(userTimezone)}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.getElementById("streakHeader").textContent = data.message;
        responseDiv.textContent = "✅ Submission successful!";
        responseDiv.style.display = 'block';
        thankYou.innerHTML = `🎉 Great job! You are now on a <strong>${data.streak}-day streak</strong>.<br>Come back tomorrow to keep it going! 💪`;
        thankYou.style.display = 'block';
        trackerForm.style.display = 'none';
      } else {
        document.getElementById("streakHeader").textContent = data.message;
        errorDiv.textContent = data.message;
        errorDiv.style.display = 'block';
      }
    })
    .catch(() => {
      errorDiv.textContent = "Error connecting. Please try again.";
      errorDiv.style.display = 'block';
    })
    .finally(() => {
      submissionInProgress = false;
    });
}

window.onload = () => {
  const savedName = localStorage.getItem("streakName");
  const savedEmail = localStorage.getItem("streakEmail");
  if (savedName && savedEmail) {
    document.getElementById("name").value = savedName;
    document.getElementById("email").value = savedEmail;
    updateStreakDisplay(savedName, savedEmail);
  }
};



