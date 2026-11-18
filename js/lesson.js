const params = new URLSearchParams(window.location.search);
const lessonId = params.get('id');

fetch('data/lessons.json')
  .then(r => r.json())
  .then(data => {
    const idx = data.lessons.findIndex(l => l.id === lessonId);
    if (idx === -1) return;
    
    const lesson = data.lessons[idx];
    document.getElementById('lessonTitle').textContent = lesson.titleZh;
    document.getElementById('lessonSub').textContent = 'Урок ' + lesson.num + ' — ' + lesson.titleRu;

    const dialogue = document.getElementById('dialogue');
    
    lesson.lines.forEach(function(line) {
      const div = document.createElement('div');
      div.className = 'line';
      
      const zhWords = line.zh.trim().split(/\s+/);
      const pinyinWords = line.pinyin.trim().split(/\s+/);

      let wordsHtml = '';
      zhWords.forEach(function(word, i) {
        const py = pinyinWords[i] || ''; 
        wordsHtml += '<span class="word" onclick="this.classList.toggle(\'show-pinyin\')" data-pinyin="' + py + '">' + word + '</span>';
      });

      div.innerHTML = '<div class="zh-text"><span class="speaker">' + line.speaker + ':</span>' + wordsHtml + '</div>' +
                      '<div class="translation">' + line.ru + '</div>';
      
      dialogue.appendChild(div);
    });

    const transBtn = document.getElementById('toggleTranslation');
    if (transBtn) {
      transBtn.onclick = function() {
        transBtn.classList.toggle('active');
        document.querySelectorAll('.translation').forEach(function(el) {
          el.classList.toggle('hidden', !transBtn.classList.contains('active'));
        });
      };
    }

    const nav = document.getElementById('nav');
    if (idx > 0) {
      nav.innerHTML += '<a href="lesson.html?id=' + data.lessons[idx-1].id + '">← Урок ' + data.lessons[idx-1].num + '</a>';
    }
    if (idx < data.lessons.length - 1) {
      nav.innerHTML += '<a href="lesson.html?id=' + data.lessons[idx+1].id + '">Урок ' + data.lessons[idx+1].num + ' →</a>';
    }
  })
  .catch(error => console.error("Ошибка загрузки урока:", error));
