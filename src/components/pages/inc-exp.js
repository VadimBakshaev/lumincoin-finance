import request from "../../utilities/http-utility";

export class IncExp {
    constructor() {
        this.tableEl = document.getElementById('tableContent');
        this.btnFilterEl = document.querySelectorAll('.filter');
        this.data = null;
        this.init();
    }
    init() {
        this.btnFilterEl.forEach(element => element.addEventListener('click', this.setActiveFilter.bind(this)));
        this.setFilter();
    }
    setActiveFilter(e) {
        this.btnFilterEl.forEach(element => element.classList.remove('active'));
        e.target.classList.add('active');
        this.setFilter() //TODO
    }
    async setFilter() {        
        const activeFilter = [...this.btnFilterEl].find(element => element.classList.contains('active'));
        const toDay = new Date().toISOString().split('T')[0];
        const fromDay = new Date();
        switch (activeFilter.id) {
            case 'day':
                fromDay.setDate(fromDay.getDate() - 1);
                break;
            case 'week':
                fromDay.setDate(fromDay.getDate() - 7)
                break;
            case 'month':
                fromDay.setMonth(fromDay.getMonth() - 1);
                break;
            case 'year':
                fromDay.setFullYear(fromDay.getFullYear() - 1);
                break;
            case 'all':
                fromDay.setFullYear(fromDay.getFullYear() - 30);
                break;
            case 'interval':
                console.log('interval');
        }
        await this.getData(`?period=interval&dateFrom=${fromDay.toISOString().split('T')[0]}&dateTo=${toDay}`);
        this.showTable();
    }
    async getData(filter) {
        const data = await request('/operations' + filter);
        if (data && data.status === 200) {
            this.data = data.response;
        }
    }
    showTable() {
        if (this.data) {
            // const table = this.data.map(item => 
            //     this.createTableRow(num, item.type, item.category, item.amount, item.date, item.comment)                
            // ).join('')
            //this.tableEl.innerHTML = table;
            this.tableEl.innerHTML = '';
            this.data.forEach((item, index) => {
                this.tableEl.insertAdjacentHTML('beforeend', this.createTableRow(index + 1, item.id, item.type, item.category, item.amount, item.date, item.comment));
            });
        }
    }
    createTableRow(num, id, type, category, amount, date, comment) {
        const dateLocal = new Date(date).toLocaleDateString();
        return `<tr>
                    <th scope="row">${num}</th>
                    <td class="${type === 'income' ? 'text-success' : 'text-danger'}">${type === 'income' ? 'доход' : 'расход'}</td>
                    <td>${category}</td>
                    <td>${amount}$</td>
                    <td>${dateLocal}</td>
                    <td>${comment}</td>
                    <td id="${id}">
                        <a href="#!" class="text-secondary" data-bs-toggle="modal" data-bs-target="#modalDialog"><i class="bi bi-trash"></i></a>
                        <a href="/edit-income" class="text-secondary"><i class="bi bi-pencil"></i></a>
                    </td>
                </tr>`
    }
}