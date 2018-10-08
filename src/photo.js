const Photo =(() => {
  let displayID = 1;

  return class Photo {
    constructor({id, secret, img_url, innerGallery}){
      this.id = id;
      this.secret = secret;
      this.img_url = img_url;
      this.displayID = displayID++;
      this.galleryContainer = innerGallery;
      this.renderPhoto();
    };

    renderPhoto(){
      let photoContainer = document.createElement('div');
      photoContainer.setAttribute('class', 'photo-container');
      let photoContent = document.createElement('div');
      photoContent.setAttribute('id', 'photo');
      photoContent.appendChild(this.photo());
      photoContainer.appendChild(photoContent);
      photoContainer.addEventListener('click', () => {
        this.openModal(this.photo());
      });
      this.galleryContainer.appendChild(photoContainer);
    };

    openModal(photo){
      let modal = document.getElementsByClassName('modal')[0];
      modal.innerHTML = ``;
      let modalContent = document.createElement('div');
      modalContent.setAttribute('class', 'modal-content');
      modalContent.innerHTML = `
        <span class="close">&times;</span>
      `;
      photo.setAttribute('class', 'modal-photo')
      modalContent.appendChild(photo);
      modal.appendChild(modalContent);
      modal.style.display = 'block';
      let span = document.getElementsByClassName("close")[0];
      span.addEventListener('click', () => {
        this.closeModal(modal);
      });
    };

    closeModal(modal){
      modal.style.display = 'none';
    };

    photo(){
      let image = document.createElement('img');
      image.setAttribute('data-id', this.id);
      image.setAttribute('alt', this.secret);
      image.setAttribute('data-displayid', this.displayID);
      image.setAttribute('src', this.img_url);
      return image;
    };
  };
})();
