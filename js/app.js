// Загружаем данные и строим список уроков
fetch('data/lessons.json')
  .then(r => r.json())
  .then(data => {
    const list = document.getElementById('lessonList');
    data.lessons.forEach(lesson => {
      const li = document.createElement('li');
      li.innerHTML = `
        <a href="lesson.html?id=${lesson.id}">
          <span class="num">Урок ${lesson.num}</span>
          <span class="zh">${lesson.titleZh}</span>
          <span class="ru">${lesson.titleRu}</span>
        </a>`;
      list.appendChild(li);
    });
  });
