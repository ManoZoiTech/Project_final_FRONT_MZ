// js/main.js
import { initForm } from './form.js';
import { initCards, addUserToCards } from './cards.js';

document.addEventListener('DOMContentLoaded', () => {
  initCards();
  initForm(addUserToCards);
});
