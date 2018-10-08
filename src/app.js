  class App {
    constructor(){
      this.body = document.getElementsByTagName('body')[0];
      this.currentPage = 0;
      this.retrievePhotos();
    }

    retrievePhotos(){
      fetch(`https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&api_key=313949dbf840d28f5febbc77ee53704b&user_id=153740145%40N05&min_upload_date=10-4-2018&format=json&nojsoncallback=1&auth_token=72157698965170392-4fd7f31a0408875f&api_sig=c93ab976726290e0c43db652e4ad0138`)
        .then(res => res.json())
        .then(json => this.dividePhotos(json.photos.photo));
    }

    dividePhotos(photos){
        let numberOfPages =  Math.ceil(photos.length / 10);
        let result = [];
        while (photos.length){
          result.push(photos.splice(0, 10))
        }
        this.photos = result;
        this.setTemplate(numberOfPages);
        this.highlightCurrentPage(this.currentPage);
        this.paginatePhotos(result);
    }

    setTemplate(num) {
      let main = document.createElement('div');
      let title = document.createElement('div');
      title.setAttribute('class', 'title');
      title.innerHTML = `PHOTO GALLERY`;
      main.appendChild(title);
      let sideNav = document.createElement('div');
      sideNav.setAttribute('class', 'sidenav');
      let arrowTop = document.createElement('a');
      arrowTop.innerHTML = `
        <svg  xmlns="http://www.w3.org/2000/svg" version="1.1" data-icon="arrow-thick-top-fill" width="16" height="16" data-container-transform="translate(3 0)" viewBox="0 0 16 16">
          <path class='arrows' d="M5 0l-5 5h3v11h4v-11h3l-5-5z" transform="translate(3)" />
        </svg>
      `; // top arrow icon for page navigation.
      arrowTop.addEventListener('click', () => {this.changePage(this.photos, this.currentPage, 'up')});
      sideNav.appendChild(arrowTop);
      for (let i = 0; i < num; i++){
        let pageLink = document.createElement('a');
        pageLink.setAttribute('id', i);
        pageLink.innerHTML = `page ${i + 1}`;
        pageLink.addEventListener('click', () => { this.changePage(this.photos, i, null)})
        sideNav.appendChild(pageLink);
      };
      let arrowBottom = document.createElement('a');
      arrowBottom.innerHTML =`
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" data-icon="arrow-thick-bottom-fill" width="16" height="16" data-container-transform="translate(3 0)" viewBox="0 0 16 16">
          <path class='arrows' d="M3 0v11h-3l5 5 5-5h-3v-11h-4z" transform="translate(3)" />
        </svg>
      `; // bottom arrow icon for page navigation.
      arrowBottom.addEventListener('click', () => {this.changePage(this.photos, this.currentPage, 'down')} );
      sideNav.appendChild(arrowBottom);
      main.appendChild(sideNav);
      let outerGallery = document.createElement('div');
      outerGallery.setAttribute('class', 'gallery-container-outer');
      main.appendChild(outerGallery);
      this.body.appendChild(main);
    }

    highlightCurrentPage(num){
      let pageLinks = document.querySelectorAll('a');
      pageLinks = Array.prototype.slice.call(pageLinks, 1, pageLinks.length - 1);
      pageLinks.forEach(link => {
        if (link.attributes.id.value === num.toString()){
          link.style.color = 'black';
        } else {
          link.style.color = 'lightgrey';
        };
      });
    };


    paginatePhotos(photos, page=0){
      let gallery = document.getElementsByClassName('gallery-container-outer')[0];
      gallery.innerHTML = `
        <div class='gallery-container-inner'>
        </div>
      `;
      let modal = document.createElement('div');
      modal.setAttribute('class', 'modal');
      gallery.appendChild(modal);
      photos[page].forEach((photo) => {
            let farmID = photo.farm;
            let serverID = photo.server;
            let id = photo.id;
            let secret = photo.secret;
            let img_url =  `https://farm${farmID}.staticflickr.com/${serverID}/${id}_${secret}.jpg`;
            let innerGallery = document.getElementsByClassName('gallery-container-inner')[0];
            new Photo({id, secret, img_url, innerGallery});

      });
    };

    changePage(photos, num, direction){
      if (((direction === 'up') && num > 0)){
        num -= 1;
      } else if (((direction === 'up') && num === 0)){
        num = photos.length - 1;
      } else if (((direction === 'down') && num < photos.length - 1)) {
        num += 1;
      } else if (((direction === 'down') && num === photos.length - 1)){
        num = 0;
      }
      this.paginatePhotos(photos, num);
      this.currentPage = num;
      this.highlightCurrentPage(this.currentPage);
    };

  };
