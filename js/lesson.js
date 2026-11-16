const params = new URLSearchParams(window.location.search);
const lessonId = params.get('id');

fetch('data/lessons.json')
  .then(r => r.json())
  .then(data => {
    const idx = data.lessons.findIndex(l => l.id === lessonId);
    const lesson = data.lessons[idx];

    document.getElementById('lessonTitle').textContent = lesson.titleZh;
    document.getElementById('lessonSub').textContent =
      `Урок ${lesson.num} — ${lesson.titleRu}`;
    document.title = `Урок ${lesson.num}: ${lesson.titleZh}`;

    const dialogue = document.getElementById('dialogue');
    lesson.lines.forEach(line => {
      const div = document.createElement('div');
      div.className = 'line';
      div.innerHTML = `
        <div class="zh-text"><span class="speaker">${line.speaker}:</span>${line.zh}</div>
        <div class="pinyin">${line.pinyin}</div>
        <div class="translation">${line.ru}</div>`;
      dialogue.appendChild(div);
    });

    // Переключатели
    const pinyinBtn = document.getElementById('togglePinyin');
    const transBtn = document.getElementById('toggleTranslation');

    pinyinBtn.onclick = () => {
      pinyinBtn.classList.toggle('active');
      document.querySelectorAll('.pinyin').forEach(el =>
        el.classList.toggle('hidden', !pinyinBtn.classList.contains('active')));
    };
    transBtn.onclick = () => {
      transBtn.classList.toggle('active');
      document.querySelectorAll('.translation').forEach(el =>
        el.classList.toggle('hidden', !transBtn.classList.contains('active')));
    };

    // Навигация
    const nav = document.getElementById('nav');
    if (idx > 0) {
      nav.innerHTML += `<a href="lesson.html?id=${data.lessons[idx-1].id}">← Урок ${data.lessons[idx-1].num}</a>`;
    }
    if (idx < data.lessons.length - 1) {
      nav.innerHTML += `<a href="lesson.html?id=${data.lessons[idx+1].id}">Урок ${data.lessons[idx+1].num} →</a>`;
    }
  });
