/* Twoim zadaniem jest utworzenie i wywołanie funkcji, która przejdzie po wszystkich książkach z dataSource.books
i wyrenderuje dla nich reprezentacje HTML w liście .books-list.
Oczywiście musisz wykorzystać w tym celu dostarczony już szablon (#template-book). */



{
  ('use strict');

  const select = {
    templateOf: {
      bookTemplate: '#template-book',
    },
    containerOf: {
      books: '.books-list',
      form: '.filters',
    },
    image: {
      imageId: '[data-id]',
      imageIdValue: 'data-id',
      img: '.book__image',
    },
  };
  const classNames = {
    bookFavorite: 'favorite',
    bookHidden: 'hidden',
  };
  const templates = {
    bookTemplate: Handlebars.compile(
      document.querySelector(select.templateOf.bookTemplate).innerHTML
    ),
  };

  const filters = [];
  const form = document.querySelector(select.containerOf.form);


  const renderBookData = (data) => {
    const booksData = data;

    for (let bookData of booksData) {
      bookData.ratingBgc = determineRatingBgc(bookData.rating);
      bookData.ratingWidth = bookData.rating * 10;

      const generatedHTML = templates.bookTemplate(bookData);
      const element = utils.createDOMFromHTML(generatedHTML);
      const bookWrapper = document.querySelector(select.containerOf.books);
      bookWrapper.appendChild(element);
    }
  };

  const filterBooks = () => {
    const dataBooks = dataSource.books;

    for (let book of dataBooks) {
      let shouldBeHidden = false;
      const bookImage = document.querySelector('.book__image[data-id="' + book.id + '"]');
      for (let filter of filters) {
        if (book.details[filter]) {
          shouldBeHidden = true;
          break;
        }
      }

      if (shouldBeHidden) {
        bookImage.classList.add(classNames.bookHidden);
      } else {
        bookImage.classList.remove(classNames.bookHidden);
      }
    }
  };

  const initActions = () => {

    const favoriteBooks = [];
    const booksListContainer = document.querySelector(select.containerOf.books);

    booksListContainer.addEventListener('dblclick', function(event) {
      event.preventDefault;
      const imageId = event.target.offsetParent.getAttribute(select.image.imageIdValue);

      if (event.target.offsetParent.classList.contains('book__image')) {
        if (favoriteBooks.includes(imageId)) {
          event.target.offsetParent.classList.remove(classNames.bookFavorite);
          favoriteBooks.splice(favoriteBooks.indexOf(imageId), 1);
        } else if (!favoriteBooks.includes(imageId)) {
          event.target.offsetParent.classList.add(classNames.bookFavorite);
          favoriteBooks.push(imageId);
        }
      }
    });

    form.addEventListener('click', function(event) {
      const element = event.target;

      if (element.tagName === 'INPUT' && element.type === 'checkbox' && element.name === 'filter') {
        if (element.checked) {
          filters.push(element.value);
        } else {
          filters.splice(filters.indexOf(element.value), 1);
        }
      }
      filterBooks();
    });
  };

  const determineRatingBgc = (rating) => {
    let ratingBgc;
    if (rating < 6) {
      ratingBgc = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%);';
    } else if (rating > 6 && rating <= 8) {
      ratingBgc = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%);';
    } else if (rating > 8 && rating <= 9) {
      ratingBgc = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%);';
    } else if (rating > 9) {
      ratingBgc = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%);';
    }
    return ratingBgc;
  };

  renderBookData(dataSource.books);
  initActions();
}


