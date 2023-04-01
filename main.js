// DOM Inizialisation
const inputJudulBuku = document.getElementById('inputBookTitle');
const inputPenulisBuku = document.getElementById('inputBookAuthor');
const inputTahunBuku = document.getElementById('inputBookYear');
const inputBukuSelesai = document.getElementById('inputBookIsComplete');
const submitForm = document.getElementById('bookSubmit');
const rakBukuBelumSelesai = document.getElementById('incompleteBookshelfList');
const rakBukuSelesai = document.getElementById('completeBookshelfList');

//Event Handler
const books = [];
const RENDER_EVENT = 'render-books';
const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'books-apps';

function generateId() {
    return +new Date();
}

function generateBookObject(id, judul, penulis, tahun, selesai) {
    return {
        id,
        title: judul,
        author: penulis,
        year: tahun,
        isComplete: selesai
    };
}

function findBookById(bookId) {
    for (const book of books) {
        if (book.id === bookId) {
            return book;
        }
    }
    return null;
}

function findBookIndexById(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser tidak mendukung local storage');
        return false;
    }
    return true;
}

function savedData() {
    if (isStorageExist()) {
        const booksParsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, booksParsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const rawData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(rawData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}


// Create, Read, Update, Delete BOOKS
function makeBook(bookObject) {
    const {id, title, author, year, isComplete} = bookObject;
    
    const titleElement = document.createElement('h3');
    titleElement.innerText = title;

    const penulisElement = document.createElement('p');
    penulisElement.innerText = author;

    const tahunElement = document.createElement('p');
    tahunElement.innerText = year;

    // Button ELements
    const divButtonElement = document.createElement('div');
    const buttonElementSelesai = document.createElement('button');
    const buttonElementHapus = document.createElement('button');

    divButtonElement.setAttribute('class', 'action');
    buttonElementSelesai.setAttribute('class', 'green');
    buttonElementHapus.setAttribute('class', 'red'); 

    buttonElementHapus.innerText = 'Hapus Buku';

    const articleElement = document.createElement('article');
    articleElement.classList.add('book_item');
    articleElement.setAttribute('id', `book-${id}`);
    divButtonElement.append(buttonElementSelesai, buttonElementHapus);
    articleElement.append(titleElement, penulisElement, tahunElement, divButtonElement);
    
    buttonElementHapus.addEventListener('click', function () {
        removeBook(id);
    })

    if(isComplete) {
        buttonElementSelesai.innerText = 'Belum Selesai';
        buttonElementSelesai.addEventListener('click', function () {
            uncompletingBook(id);
        });
    } else {
        buttonElementSelesai.innerText = 'Selesai';
        buttonElementSelesai.addEventListener('click', function () {
            completingBook(id);
        })
    }

    return articleElement;
}

function completingBook(bookId) {
    const book = findBookById(bookId);

    if (book == null) return;

    book.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    savedData();
}

function uncompletingBook(bookId) {
    const book = findBookById(bookId);
    if (book == null) return;

    book.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    savedData();
}

function removeBook(bookId) {
    const bookIndex = findBookIndexById(bookId);

    if (bookIndex === -1) return;

    books.splice(bookIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    savedData();
}

function addBook() {
    const id = generateId();
    const judul = inputJudulBuku.value;
    const penulis = inputPenulisBuku.value;
    const tahun = inputTahunBuku.value;
    const selesai = inputBukuSelesai.checked;

    const bookObject = generateBookObject(id, judul, penulis, tahun, selesai);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    savedData();
}

// Document Event Listener
document.addEventListener('DOMContentLoaded', function() {
    submitForm.addEventListener('click', function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(SAVED_EVENT, function () {
    alert('Data berhasil disimpan');
});

document.addEventListener(RENDER_EVENT, function () {
    // Clearing Bookshelf
    rakBukuBelumSelesai.innerHTML = '';
    rakBukuSelesai.innerHTML = '';

    for (const book of books) {
        const bookElement = makeBook(book);
        if (book.isComplete) {
            rakBukuSelesai.append(bookElement);
        } else {
            rakBukuBelumSelesai.append(bookElement);
        }
    }
});