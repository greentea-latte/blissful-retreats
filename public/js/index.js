/* eslint-disable */
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import '@babel/polyfill';
import { bookRetreat } from './stripe';
import { showAlert } from './alerts';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
// manipulating each DOM element due to issue looping in PUG
const bookBtn = document.querySelector('.book-retreat');
const bookBtnTwo = document.querySelector('.book-retreat-2');
const bookBtnThree = document.querySelector('.book-retreat-3');
const bookBtnFour = document.querySelector('.book-retreat-4');
const bookBtnFive = document.querySelector('.book-retreat-5');
const bookBtnSix = document.querySelector('.book-retreat-6');
const bookBtnSeven = document.querySelector('.book-retreat-7');
const bookBtnEight = document.querySelector('.book-retreat-8');
// DELEGATION

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateSettings({ name, email }, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

// manipulating each DOM element due to issue looping in PUG
  bookBtn.addEventListener('click', e => {
    const { retreatId } = e.target.dataset;
    bookRetreat(retreatId);
  });

  bookBtnTwo.addEventListener('click', e => {
    const { retreatId } = e.target.dataset;
    bookRetreat(retreatId);
  });

  bookBtnThree.addEventListener('click', e => {
    const { retreatId } = e.target.dataset;
    bookRetreat(retreatId);
  });

  bookBtnFour.addEventListener('click', e => {
    const { retreatId } = e.target.dataset;
    bookRetreat(retreatId);
  });

  bookBtnFive.addEventListener('click', e => {
      const { retreatId } = e.target.dataset;
      bookRetreat(retreatId);
  });

  bookBtnSix.addEventListener('click', e => {
    const { retreatId } = e.target.dataset;
    bookRetreat(retreatId);
  });

  bookBtnSeven.addEventListener('click', e => {
    const { retreatId } = e.target.dataset;
    bookRetreat(retreatId);
});

  bookBtnEight.addEventListener('click', e => {
    const { retreatId } = e.target.dataset;
    bookRetreat(retreatId);
});

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);
