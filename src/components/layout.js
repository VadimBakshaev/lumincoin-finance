export class Layout {
  constructor() {
    this.navBtnEl = document.getElementById("navBtn");
    this.overlayEl = document.getElementById("overlay");
    this.navBarEl = document.getElementById("navBar");
    this.navLinkEl = document.querySelectorAll(".nav-link");
    this.selectBtnEl = document.querySelector(".nav-link.btn");
    this.selectAreaEl = document.getElementById("category-collapse");
    this.navBtnEl.addEventListener("click", this.openMenu.bind(this));
    this.navBarEl.addEventListener("click", this.closeMenu.bind(this));
  }
  // функция для отображения мобильного меню
  openMenu() {
    this.navBtnEl.classList.add("close");
    this.overlayEl.style.display = "block";
    this.navBarEl.classList.add("open");
  }
  // фукнция для скрытия мобильного меню
  closeMenu(e) {
    // если это кнопка "Категории"
    if (e.target.classList.contains("nav-link") && e.target.getAttribute('href') === null)
      return;
    this.navBtnEl.classList.remove("close");
    this.overlayEl.style.display = "none";
    this.navBarEl.classList.remove("open");
  }
  // установка активного пункта меню и отображение выпадающего списка,
  // на вход принимает текущий роут
  setActive(route) {
    // в цикле перебираем все элементы меню
    this.navLinkEl.forEach((item) => {
      // убираем ранее установленный класс "active"
      item.classList.remove("active");
      // находим нужный пункт меню
      if (item.getAttribute("href") === route) {
        // если это в выпадающем списке
        if (route === "/income" || route === "/expenses") {
          // устанавливаем активное состояние для кнопки
          this.selectBtnEl.classList.add("active");
          // меняем отображение псевдоэлемента
          this.selectBtnEl.ariaExpanded = true;
          // разворачиваем список
          this.selectAreaEl.classList.add("show");
        } else { // если нет, то наоборот..
          this.selectBtnEl.classList.remove("active");
          this.selectBtnEl.ariaExpanded = false;
          this.selectAreaEl.classList.remove("show");
        }
        item.classList.add("active");
      }
    });
  }
}
