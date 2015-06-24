import bus from 'bus';
import Store from '../store/store';
import Log from 'debug';

const log = new Log('democracyos:forums');

class Forums extends Store {

  constructor () {
    super();
    this.loadFromParamsMiddleware = this.loadFromParamsMiddleware.bind(this);

    bus.on('logout', this.unloadUserForum.bind(this));
  }

  name () {
    return 'forums';
  }

  url (id) {
    return `/api/forum/${id}`;
  }

  parse (forum) {
    forum.url = '/' + forum.name;
    return forum;
  }

  /**
   * Get the Forum of the current user
   *
   * @return {Promise} fetch
   * @api public
   */
  getUserForum () {
    return this.get('mine');
  }

  unloadUserForum () {
    return this.unload('mine');
  }

  destroyUserForum () {
    return this.destroy('mine');
  }

  /**
   * Middleware to load forum from current page url, gets it from '/:forum'.
   *
   * @return {Middleware}
   * @api public
   */
  loadFromParamsMiddleware (ctx, next) {
    const name = ctx.params.forum;

    this.get(name)
      .then(forum => {
        ctx.forum = forum;
        next();
      })
      .catch(err => log('Found error %s', err));
  }
}

const forums = new Forums();

export default forums;