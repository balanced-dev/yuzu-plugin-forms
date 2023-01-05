import { Controller } from "stimulus";

export default class extends Controller {

  static get targets() {
    return [
      'input',
      'selected',
    ];
  }

  initialize() {
    this.update();
    this.inputTarget.addEventListener('change', (e) => {this.update(e)});
  }

  update(e) {
    const files = this.inputTarget.files;
    const classAction = files.length > 0 ? 'add' : 'remove';
    this.element.classList[classAction]('is-populated');

    this.selectedTarget.innerHTML = '';

    [...files].forEach(file => {
      const span = document.createElement('SPAN');
      span.appendChild(document.createTextNode(file.name));
      this.selectedTarget.appendChild(span);
    });
  }
};