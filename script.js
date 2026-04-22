if (!localStorage.getItem("snippets")) {
  const demo = [];

  for (let i = 1; i <= 50; i++) {
    demo.push({
      title: "Demo Snippet " + i,
      category: ["Frontend", "Backend", "DSA"][i % 3],
      tags: ["demo", "code"],
      code: `// Example ${i}
for (let i = 0; i < 5; i++) {
  console.log("Demo ${i}");
}`,
      favorite: false
    });
  }

  localStorage.setItem("snippets", JSON.stringify(demo));
}

let user = localStorage.getItem("user");

if (!user) window.location.href = "login.html";

let snippets = JSON.parse(localStorage.getItem("snippets")) || [];
snippets = snippets.filter(s => s.user === user);

let theme = localStorage.getItem("theme") || "dark";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("addBtn").addEventListener("click", addSnippet);
  document.getElementById("search").addEventListener("input", search);

  applyTheme();
  display();
});

/* ADD */
function addSnippet() {
  const title = document.getElementById("title").value.trim();
  const code = document.getElementById("code").value.trim();
  const tags = document.getElementById("tags").value.split(",");
  const category = document.getElementById("category").value;

  if (!title || !code) {
    showToast("Fill all fields");
    return;
  }

  snippets.push({
    title,
    code,
    tags,
    category,
    folder: category,
    favorite: false,
    createdAt: new Date().toLocaleString(),
    user
  });

  save();
  clearForm();
}

/* SAVE */
function save() {
  localStorage.setItem("snippets", JSON.stringify(snippets));
  display();
}

function display(data = snippets) {
  const content = document.getElementById("content");
  content.innerHTML = "";

  if (data.length === 0) {
    content.innerHTML = `<p class="empty">🚀 No snippets yet</p>`;
    return;
  }

  data.forEach((s, i) => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${s.title}</h3>
      <p>${s.category}</p>

      <pre>${escapeHTML(s.code)}</pre>

      <div>
        ${s.tags.map(t => `<span class="tag-chip">${t}</span>`).join("")}
      </div>

      <div class="actions">
        <button onclick="copy(${i})">📋</button>
        <button onclick="del(${i})">❌</button>
        <button onclick="edit(${i})">✏ Edit</button>
        <button onclick="toggleFav(${i})">${s.favorite ? "⭐" : "☆"}</button>
        <button onclick="share(${i})">🔗</button>
      </div>
    `;

    content.appendChild(div);
  });
}

function edit(i) {
  document.getElementById("title").value = snippets[i].title;
  document.getElementById("code").value = snippets[i].code;
  document.getElementById("tags").value = snippets[i].tags.join(",");
  document.getElementById("category").value = snippets[i].category;

  del(i); // remove old
}

/* FEATURES */
function del(i){ snippets.splice(i,1); save(); }
function toggleFav(i){ snippets[i].favorite=!snippets[i].favorite; save(); }

function copy(i){
  navigator.clipboard.writeText(snippets[i].code);
  showToast("Copied!");
}


function share(i){
  const url = location.origin + "/view.html?data=" + btoa(JSON.stringify(snippets[i]));
  navigator.clipboard.writeText(url);
  showToast("Link copied!");
}

/* FILTERS */
function filterFolder(folder){
  display(snippets.filter(s => s.folder === folder));
}

function showFavorites(){
  display(snippets.filter(s => s.favorite));
}

function search(e){
  const q = e.target.value.toLowerCase();
  display(snippets.filter(s => s.title.toLowerCase().includes(q)));
}

/* DASHBOARD */
function showDashboard(){
  document.getElementById("content").innerHTML = `<canvas id="chart"></canvas>`;

  new Chart(document.getElementById("chart"), {
    type: "bar",
    data: {
      labels: ["Frontend","Backend","DSA"],
      datasets: [{
        data: [
          snippets.filter(s=>s.category==="Frontend").length,
          snippets.filter(s=>s.category==="Backend").length,
          snippets.filter(s=>s.category==="DSA").length
        ]
      }]
    }
  });
}

/* ACTIVITY */
function showActivity(){
  let html = "<h3>Activity</h3>";

  snippets.slice().reverse().forEach(s => {
    html += `<div class="card">🕒 ${s.title} - ${s.createdAt}</div>`;
  });

  document.getElementById("content").innerHTML = html;
}

/* EXPORT */
function exportData(){
  const blob=new Blob([JSON.stringify(snippets)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="snippets.json";
  a.click();
}

/* THEME */
function toggleTheme(){
  theme = theme==="dark"?"light":"dark";
  localStorage.setItem("theme",theme);
  applyTheme();
}

function applyTheme(){ document.body.className = theme; }

/* LOGOUT */
function logout(){
  localStorage.removeItem("user");
  window.location.href="login.html";
}

/* UTILS */
function escapeHTML(str){
  return str.replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function showToast(msg){
  let t=document.createElement("div");
  t.className="toast";
  t.innerText=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.classList.add("show"),100);
  setTimeout(()=>t.remove(),3000);
}

function toggleAI() {
  const panel = document.getElementById("aiPanel");
  panel.style.display = panel.style.display === "flex" ? "none" : "flex";
}

function sendAI() {
  const input = document.getElementById("aiInput");
  const msg = input.value;
  if (!msg) return;

  addMessage(msg, "user");

  // Simple AI (rule-based)
  let reply = "I can help explain your code!";

  if (msg.toLowerCase().includes("loop")) {
    reply = "Loops repeat a block of code multiple times.";
  } else if (msg.toLowerCase().includes("array")) {
    reply = "Arrays store multiple values in a single variable.";
  }

  setTimeout(() => addMessage(reply, "bot"), 500);

  input.value = "";
}

function addMessage(text, type) {
  const box = document.getElementById("chatBox");
  const div = document.createElement("div");

  div.className = "msg " + type;
  div.innerText = text;

  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function loadDemoData() {
  snippets = [

    // FRONTEND
    {
      title: "Flexbox Center",
      category: "Frontend",
      tags: ["css"],
      code: "display:flex; justify-content:center; align-items:center;",
      favorite: false
    },

    {
      title: "Button Click JS",
      category: "Frontend",
      tags: ["js"],
      code: "document.querySelector('button').onclick = () => alert('Clicked');",
      favorite: false
    },

    // BACKEND
    {
      title: "Node Express Server",
      category: "Backend",
      tags: ["node"],
      code: "const express = require('express'); const app = express(); app.listen(3000);",
      favorite: false
    },

    {
      title: "Python API",
      category: "Backend",
      tags: ["python"],
      code: "from flask import Flask\napp = Flask(__name__)",
      favorite: false
    },

    // DSA
    {
      title: "Binary Search",
      category: "DSA",
      tags: ["algo"],
      code: "def binary_search(arr, x): pass",
      favorite: false
    },

    {
      title: "Factorial",
      category: "DSA",
      tags: ["math"],
      code: "def fact(n): return 1 if n==0 else n*fact(n-1)",
      favorite: false
    }

  ];

  save();
}

function clearForm(){
  document.getElementById("title").value = "";
  document.getElementById("code").value = "";
  document.getElementById("tags").value = "";
}