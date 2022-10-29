/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

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

  class BooksList {
    constructor() {
      this.filters = [];
      this.favoriteBooks = [];

      this.initData();
      this.getElements();
      this.initActions();
    }

    initData() {
      this.data = dataSource.books;

      for (let bookData of this.data) {
        bookData.ratingBgc = this.determineRatingBgc(bookData.rating);
        bookData.ratingWidth = bookData.rating * 10;

        const generatedHTML = templates.bookTemplate(bookData);
        const element = utils.createDOMFromHTML(generatedHTML);
        const bookWrapper = document.querySelector(select.containerOf.books);
        bookWrapper.appendChild(element);
      }
    }

    getElements() {
      const thisList = this;

      thisList.form = document.querySelector(select.containerOf.form);
      thisList.booksListContainer = document.querySelector(
        select.containerOf.books
      );
      //bookImage ?
      //bookWrapper ?
    }

    filterBooks() {
      const dataBooks = this.data;

      for (let book of dataBooks) {
        let shouldBeHidden = false;
        const bookImage = document.querySelector(
          '.book__image[data-id="' + book.id + '"]'
        );
        for (let filter of this.filters) {
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
    }

    initActions() {
      const thisList = this;

      thisList.booksListContainer.addEventListener(
        'dblclick',
        function (event) {
          event.preventDefault;
          const imageId = event.target.offsetParent.getAttribute(
            select.image.imageIdValue
          );

          if (event.target.offsetParent.classList.contains('book__image')) {
            if (thisList.favoriteBooks.includes(imageId)) {
              event.target.offsetParent.classList.remove(
                classNames.bookFavorite
              );
              thisList.favoriteBooks.splice(
                thisList.favoriteBooks.indexOf(imageId),
                1
              );
            } else if (!thisList.favoriteBooks.includes(imageId)) {
              event.target.offsetParent.classList.add(classNames.bookFavorite);
              thisList.favoriteBooks.push(imageId);
            }
          }
        }
      );

      thisList.form.addEventListener('click', function (event) {
        const element = event.target;

        if (
          element.tagName === 'INPUT' &&
          element.type === 'checkbox' &&
          element.name === 'filter'
        ) {
          if (element.checked) {
            thisList.filters.push(element.value);
          } else {
            thisList.filters.splice(thisList.filters.indexOf(element.value), 1);
          }
        }
        thisList.filterBooks();
      });
    }

    determineRatingBgc(rating) {
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
    }
  }

  new BooksList();
}
