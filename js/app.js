fetch('data/lessons.json')
  .then(r => r.json())
  .then(data => {
    const list = document.getElementById('lessonList');
    data.lessons.forEach(lesson => {
      const li = document.createElement('li');
      // ВНИМАНИЕ: Здесь должна быть ссылка на lesson.html (страницу), а не на lesson.js (скрипт)
      li.innerHTML = `
        <a href="lesson.html?id=${lesson.id}">
          <span class="num">Урок ${lesson.num}</span>
          <span class="zh">${lesson.titleZh}</span>
          <span class="ru">${lesson.titleRu}</span>
        </a>`;
      list.appendChild(li);
    });
  })
  .catch(error => console.error("Ошибка:", error));
