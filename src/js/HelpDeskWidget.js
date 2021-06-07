import createRequest from './Request';
import TicketsList from './TicketsList';

export default class HelpDeskWidget {
  constructor() {
    this.ticketsList = new TicketsList();
    this.form = document.forms.edit;
    this.formHeader = this.form.querySelector('.form-header');
    this.modal = document.forms.modal;
    this.addButton = document.querySelector('.header-button');
    this.formTitle = document.querySelector('.form-header');
    this.name = document.getElementById('input_name');
    this.description = document.getElementById('input_description');
    this.save = document.getElementById('save_button');
    this.cancel = document.getElementById('cancel_button');
    this.cancelModal = document.getElementById('cancel_modal_button');
    this.editTicket = null;
    this.deletedTicket = null;
  }

  async init() {
    const tickets = await createRequest({
      url: 'alltickets',
    });
    this.ticketsList.render(tickets);
    this.events();
  }

  events() {
    this.addButton.addEventListener('click', () => {
      this.showModal(this.form);
      this.formHeader.innerText = 'Добавить тикет';
    });
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.editTicket) {
        this.editTicketHandler();
        this.editTicket = null;
        return;
      }
      this.addTicketHandler();
    });
    this.cancel.addEventListener('click', (e) => {
      e.preventDefault();
      this.form.reset();
      this.form.classList.remove('edit-active');
    });
    this.cancelModal.addEventListener('click', (e) => {
      e.preventDefault();
      this.deletedTicket = null;
      this.modal.classList.remove('modal-active');
    });
    this.ticketsList.list.addEventListener('click', (e) => {
      if (e.target.classList.contains('ticket-name')) {
        const ticketTooltip = e.target.parentElement.querySelector('.ticket-tooltip');
        if (ticketTooltip) {
          ticketTooltip.classList.toggle('hidden');
        }
      }
      if (e.target.classList.contains('edit-button')) {
        this.showModal(this.form);
        this.formHeader.innerText = 'Изменить тикет';
        this.editTicket = e.target.closest('.ticket');
        this.name.value = this.editTicket.querySelector('.ticket-name').innerText;
        this.description.value = this.editTicket.querySelector('.ticket-tooltip').innerText;
      }
      if (e.target.classList.contains('delete-button')) {
        this.deletedTicket = e.target.closest('.ticket');
        this.showModal(this.modal);
      }
      if (e.target.classList.contains('done')) {
        this.editTicket = e.target.closest('.ticket');
        let status = false;
        if (e.target.classList.contains('done-false')) {
          e.target.classList.remove('done-false');
          e.target.classList.add('done-true');
          status = true;
        } else {
          e.target.classList.remove('done-true');
          e.target.classList.add('done-false');
        }
        this.changeStatusHandler(status);
      }
    });
    this.modal.addEventListener('submit', (e) => {
      e.preventDefault();
      this.deleteTicketHandler();
    });
  }

  showModal(el) {
    if (el.classList.contains('edit')) {
      this.form.classList.add('edit-active');
    } else {
      this.modal.classList.add('modal-active');
    }
    el.style.top = '100px';
    el.style.left = `${el.offsetParent.offsetWidth / 2 - el.offsetWidth / 2}px`;
  }

  async addTicketHandler() {
    const formData = new FormData();
    formData.append('name', this.name.value);
    formData.append('description', this.description.value);
    const ticket = await createRequest({
      url: 'createTicket',
      method: 'POST',
      body: formData,
    });
    this.ticketsList.render(ticket);
    if (ticket) {
      this.form.reset();
      this.form.classList.remove('edit-active');
    }
  }

  async deleteTicketHandler() {
    const ticketId = this.deletedTicket.dataset.id;
    const response = await createRequest({
      url: `deleteById/${ticketId}`,
      method: 'DELETE',
    });
    if (response.success) {
      this.deletedTicket.remove();
      this.deletedTicket = null;
    }
    this.modal.classList.remove('modal-active');
  }

  async editTicketHandler() {
    const ticketId = this.editTicket.dataset.id;
    const formData = new FormData();
    formData.append('name', this.name.value);
    formData.append('description', this.description.value);
    const updateTickets = await createRequest({
      url: `updateById/${ticketId}`,
      method: 'PUT',
      body: formData,
    });
    this.ticketsList.render(updateTickets);
    if (updateTickets) {
      this.form.reset();
      this.form.classList.remove('edit-active');
    }
  }

  async changeStatusHandler(status) {
    const ticketId = this.editTicket.dataset.id;
    const formData = new FormData();
    formData.append('status', status);
    const updateTickets = await createRequest({
      url: `updateById/${ticketId}`,
      method: 'PUT',
      body: formData,
    });
    this.ticketsList.render(updateTickets);
  }
}
