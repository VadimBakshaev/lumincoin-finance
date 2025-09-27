import request from "../../utilities/http-utility";

export class Category {
    constructor(openRoute, category) {
        this.openRoute = openRoute;
        this.category = category;
        this.categoryBoxEl = document.getElementById('categoryBox');
        this.deleteBtnEl = document.getElementById('deleteBtn');
        this.getData();
    }
    async getData() {
        if (this.category === 'income') {
            document.getElementById('modalContent').innerText = 'Вы действительно хотите удалить категорию? Связанные доходы останутся без категории.';
        };
        if (this.category === 'expense') {
            document.getElementById('modalContent').innerText = 'Вы действительно хотите удалить категорию?';
        }
        const data = await request('/categories/' + this.category);
        document.getElementById('addItem').href = '/add-category-' + this.category;
        this.showCard(data);
    }
    showCard(data) {
        if (data && data.status === 200) {
            this.categoryBoxEl
                .insertAdjacentHTML('afterbegin', data.response
                    .map(item => this.createCard(item.id, item.title))
                    .join(''));
            this.setListener();
        }
    }
    createCard(id, title) {
        return `<div class="p-3 p-md-3_5 text-medium border rounded" id="${id}">
                  <h3 class="fs-3 ">${title}</h3>
                  <a class="btn btn-primary fs-7 edit-btn">Редактировать</a>
                  <a class="btn btn-danger fs-7 del-btn" data-bs-toggle="modal" data-bs-target="#modalDialog">Удалить</a>
                </div>`
    }
    setListener() {
        document.querySelectorAll('.edit-btn').forEach(elem => elem.addEventListener('click', (e) => {
            this.openRoute('/edit-category-' + this.category + '?id=' + e.target.parentNode.id);
        }));
        document.querySelectorAll('.del-btn').forEach(elem => elem.addEventListener('click', (e) => {
            this.deleteBtnEl.onclick = async () => {
                await request('/categories/' + this.category + '/' + e.target.parentNode.id, 'DELETE');
                this.openRoute('/' + this.category);
            }
        }));
    }
}