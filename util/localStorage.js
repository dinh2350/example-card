// LocalStorage
export function saveLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
export function getLocalStorage(key) {
  if (localStorage.getItem(key)) {
    return JSON.parse(localStorage.getItem(key));
  } else {
    return;
  }
}
