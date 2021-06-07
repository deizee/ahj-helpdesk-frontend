export default class TicketsList {
  constructor() {
    this.list = document.getElementById('tickets_conteiner');
  }

  render(tickets) {
    if (tickets.length > 1) {
      this.list.textContent = '';
      tickets.forEach((el) => {
        this.list.insertAdjacentHTML('beforeend', this.renderTicket(el));
      });
      return;
    }

    this.list.insertAdjacentHTML('beforeend', this.renderTicket(tickets[0]));
  }

  renderTicket({ id, name, status, description, created }) {
    const sourceDate = new Date(created);
    const date = `${sourceDate.toLocaleDateString()} ${sourceDate
      .toLocaleTimeString()
      .slice(0, 5)}`;
    return `
      <tr class='ticket' data-id='${id}' data-status='true'>
        <td class='ticket-status'>
          <span class='done done-${status}'></span>
        </td>
        <td class='ticket-content'>
          <div class='ticket-name'>${name}</div>
          <div class='ticket-tooltip hidden'>${description}</div>
        </td>
        <td>
          <div class='ticket-date'>${date}</div>
        </td>
        <td class='ticket-actions'>
          <span class='edit-button'><span class='text-btn'>Edit</span></span>
          <span class='delete-button'><span class='text-btn'>Delete</span></span>
        </td>
      </tr>
    `;
  }
}
