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
      
      // Разбиваем текст на слова
      const zhWords = line.zh.trim().split(/\s+/);
      const pinyinWords = line.pinyin.trim().split(/\s+/);

      let wordsHtml = '';
      let pyIndex = 0; // Индекс для пиньиня

      zhWords.forEach((word) => {
        // Если слово состоит только из знаков препинания, просто выводим его
        if (/^[！？。，、；：！？]$/.test(word)) {
          wordsHtml += `<span class="word" style="cursor:default; border-bottom:none;">${word}</span>`;
        } else {
          // Берем пиньинь, который соответствует этому слову
          const py = pinyinWords[pyIndex] || ''; 
          wordsHtml += `<span class="word" onclick="this.classList.toggle('show-pinyin')" data-pinyin="${py}">${word}</span>`;
          pyIndex++; // Сдвигаем индекс пиньиня только для реальных слов
        }
      });

      div.innerHTML = `
        <div class="zh-text"><span class="speaker">${line.speaker}:</span>${wordsHtml}</div>
        <div class="translation hidden">${line.ru}</div>`;
      
      dialogue.appendChild(div);
    });

    // Кнопка перевода (теперь работает как надо)
    const transBtn = document.getElementById('toggleTranslation');
    if(transBtn) {
        transBtn.onclick = () => {
          transBtn.classList.toggle('active');
          document.querySelectorAll('.translation').forEach(el =>
            el.classList.toggle('hidden', !transBtn.classList.contains('active')));
        };
    }

    // Навигация
    const nav = document.getElementById('nav');
    if (idx > 0) {
      nav.innerHTML += `<a href="lesson.html?id=${data.lessons[idx-1].id}">← Урок ${data.lessons[idx-1].num}</a>`;
    }
    if (idx < data.lessons.length - 1) {
      nav.innerHTML += `<a href="lesson.html?id=${data.lessons[idx+1].id}">Урок ${data.lessons[idx+1].num} →</a>`;
    }
  })
  .catch(error => console.error("Ошибка:", error));
