const params = new URLSearchParams(window.location.search);
const lessonId = params.get('id');

fetch('data/lessons.json')
  .then(r => r.json())
  .then(data => {
    const idx = data.lessons.findIndex(l => l.id === lessonId);
    if (idx === -1) return; 
    const lesson = data.lessons[idx];

    document.getElementById('lessonTitle').textContent = lesson.titleZh;
    document.getElementById('lessonSub').textContent = `Урок ${lesson.num} — ${lesson.titleRu}`;
    document.title = `Урок ${lesson.num}: ${lesson.titleZh}`;

    const dialogue = document.getElementById('dialogue');
    
    lesson.lines.forEach(line => {
      const div = document.createElement('div');
      div.className = 'line';
      
      // УМНАЯ РАЗБИВКА: отделяем китайские иероглифы от пунктуации
      const zhClean = line.zh.replace(/([！？。，、；：])/g, ' $1 ');
      const pyClean = line.pinyin.replace(/([!?.,;:])/g, ' $1 ');

      const zhWords = zhClean.trim().split(/\s+/);
      const pinyinWords = pyClean.trim().split(/\s+/);

      let wordsHtml = '';
      let pyIndex = 0;

      zhWords.forEach((word) => {
        // Если слово — это знак препинания, просто выводим его без клика
        if (/^[！？。，、；：]$/.test(word)) {
          wordsHtml += `<span style="margin-right: 2px;">${word}</span>`;
        } else {
          // Берем пиньинь по порядку
          const py = pinyinWords[pyIndex] || ''; 
          wordsHtml += `<span class="word" onclick="this.classList.toggle('show-pinyin')" data-pinyin="${py}">${word}</span>`;
          pyIndex++;
        }
      });

      div.innerHTML = `
        <div class="zh-text"><span class="speaker">${line.speaker}:</span>${wordsHtml}</div>
        <div class="translation hidden">${line.ru}</div>`;
      
      dialogue.appendChild(div);
    });

    const transBtn = document.getElementById('toggleTranslation');
    if(transBtn) {
        transBtn.onclick = () => {
          transBtn.classList.toggle('active');
          document.querySelectorAll('.translation').forEach(el =>
            el.classList.toggle('hidden', !transBtn.classList.contains('active')));
        };
    }

    const nav = document.getElementById('nav');
    if (idx > 0) {
      nav.innerHTML += `<a href="lesson.html?id=${data.lessons[idx-1].id}">← Урок ${data.lessons[idx-1].num}</a>`;
    }
    if (idx < data.lessons.length - 1) {
      nav.innerHTML += `<a href="lesson.html?id=${data.lessons[idx+1].id}">Урок ${data.lessons[idx+1].num} →</a>`;
    }
  })
  .catch(error => console.error("Ошибка:", error));
