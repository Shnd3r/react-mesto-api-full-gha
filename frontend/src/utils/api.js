class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
    this._credentials = options.credentials;
  }

  /**
   * Универсальный метод обработки ответа от сервера
   * @private
   * @param {object} res объект response с сервера
   * @returns {(json|string)} json с данными сервера или строку с ошибкой с сервера
   */
  _renderServerResponce(res) {
    if (res.ok) {
      return res.json();
    } else {
      // если ошибка, отклоняем промис
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  }

  /**
  * Универсальный метод запроса с проверкой ответа
  * @private
  * @param {string} url эндпоинт следующий за базовым URL
  * @param {object} options объект настроек HTTP запроса
  * @returns {(json|string)} json с данными сервера или строка с ошибкой с сервера
  */
  _request(url, options) {
    options.headers = this._headers;
    options.credentials = this._credentials;
    return fetch(`${this._baseUrl}/${url}`, options)
      .then(res => {
        return this._renderServerResponce(res)
      })
  }

  /**
   * Метод загрузки информации о пользователе с сервера
   * @return {function} возвращает результат работы this._request с переданными аргументами   
   */
  getUserInfo() {
    return this._request(`users/me`, { method: 'GET' })
  }

  /**
   * Метод загрузки карточек с сервера
   * @return {function} возвращает результат работы this._request с переданными аргументами   
   */
  getInitialCards() {
    return this._request(`cards`, { method: 'GET' })
  }

  /**
   * Метод получения общей информации (метода 1 и метода 2)
   * @return {Promise} возвращает подтвержденный промис двух методов this.getInitialCards и this.getUserInfo
   */
  getAppInfo() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }

  /**
   * Метод редактирования профиля на сервере
   * @param {string} name имя пользователя страницы
   * @param {string} about доп. информация о пользователе страницы
   * @return {function} возвращает результат работы this._request с переданными аргументами   
   */
  editProfile(name, about) {
    return this._request(`users/me`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: name,
        about: about
      }),
    })
  }

  /**
   * Метод добавления новой карточки на сервер
   * @param {string} name заголовок карточки
   * @param {string} link ссылка на картинку карточки
   * @return {function} возвращает результат работы this._request с переданными аргументами   
   */
  addCard(name, link) {
    return this._request(`cards`, {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        link: link
      }),
    })
  }

  /**
  * Метод удаления карточки с сервера
  * @param {string} cardId свойство _id внутри объекта card
  * @return {function} возвращает результат работы this._request с переданными аргументами   
  */
  deleteCard(cardId) {
    return this._request(`cards/${cardId}`, { method: 'DELETE' })
  }

  /**
  * Метод изменения состояния лайка на сервере
  * @param {string} cardId свойство _id внутри объекта card
  * @param {boolean} isLiked состояние лайка карточки true или false
  * @returns {function} возвращает результат работы метода removeLike и setLike, в зависмости от состояния лайка карточки  
  */
  changeLikeCardStatus(cardId, isLiked) {
    if (isLiked) {
      return this.removeLike(cardId)
    } else {
      return this.setLike(cardId)
    }
  }

  /**
   * Метод постановки лайка на сервере
   * @param {string} cardId свойство _id внутри объекта card
   * @returns {function} возвращает результат работы this._request с переданными аргументами 
   */
  setLike(cardId) {
    return this._request(`cards/${cardId}/likes`, { method: 'PUT' })
  }


  /**
   * Метод снятия лайка на сервере
   * @param {string} cardId свойство _id внутри объекта card
   * @returns {function} возвращает результат работы this._request с переданными аргументами 
   */
  removeLike(cardId) {
    return this._request(`cards/${cardId}/likes`, { method: 'DELETE' })
  }

  /**
  * Метод обновление аватара пользователя на сервере
  * @param {string} avatar ссылка на картинку-аватар пользователя
  * @returns {function} возвращает результат работы this._request с переданными аргументами 
  */
  updateAvatar(avatar) {
    return this._request(`users/me/avatar`, {
      method: 'PATCH',
      body: JSON.stringify({
        avatar: avatar
      }),
    })
  }

  /**
   * Метод регистрации пользователя
   * @param {string} email email пользователя из инпута формы
   * @param {string} password пароль пользователя из инпута формы
   * @returns {function} возвращает результат работы this._request с переданными аргументами 
   */
  register(email, password) {
    return this._request(`signup`, {
      method: 'POST',
      body: JSON.stringify({
        password: password,
        email: email,
      }),
    })
  }

  /**
   * Метод авторизации пользователя
   * @param {string} email email пользователя из инпута формы
   * @param {string} password пароль пользователя из инпута формы
   * @returns {function} возвращает результат работы this._request с переданными аргументами 
   */
  authorize(email, password) {
    return this._request(`signin`, {
      method: 'POST',
      body: JSON.stringify({
        password: password,
        email: email,
      }),
    })
  }

  /**
  * Метод выхода из личного кабинета пользователя
  * @returns {function} возвращает результат работы this._request с переданными аргументами 
  */
  signOut() {
    return this._request(`signout`, { method: 'DELETE' })
  }
}

const api = new Api({
  baseUrl: 'https://api.mesto.shnd3r.nomoredomainsicu.ru',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
});

export { api };


