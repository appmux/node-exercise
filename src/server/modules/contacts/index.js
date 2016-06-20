import url from 'url';
import {_extend as extend} from 'util';
import getRoutes from './contacts.route.js';
import configuraton from './contacts.config.json';

export {getRoutes};

export function factory(sm) {
  this.configuration = configuraton;
  this.store = sm.get('store');
  // this.index = undefined;

  this.indexAction = indexAction;
  this.createAction = createAction;
  this.deleteAction = deleteAction;

  return this;
}

function indexAction(req, res) {
  // TODO This definitely can be extracted into a generic pagination plugin.
  let items = extend([], this.store.get('contacts') || []);
  let linksUrl = extend({}, req.url);

  let sortBy = ['type', 'name', 'title', 'phone', 'ext', 'fax', 'email']
      .find(sortBy => sortBy === req.url.query.sortBy) || 'id';
  let order = ['desc'].find(order => order === req.url.query.order) || 'asc';

  let pages = Math.ceil(items.length / this.configuration.itemsPerPage);
  let page = Math.min(pages, req.url.query.page || 1) - 1;
  let pageIndexStart = page * this.configuration.itemsPerPage;

  let pager = {
    items: items.length,
    pages: pages,
    current: page,
    next: page + 2 <= pages ? page + 2 : undefined,
    previous: page > 0 ? page : undefined
  };

  items = items
    .sort(sortItemsBy(sortBy, order))
    .slice(pageIndexStart, pageIndexStart + this.configuration.itemsPerPage)
    .reduce((configs, config) => {
      let self = extend({}, linksUrl);
      self.pathname += ('/' + config.name);
      self.query = {};
      self.search = undefined;

      let links = {
        self: url.format(self)
      };
      configs.push(extend({links: links}, config));
      return configs;
    }, []);

  let links = {
    self: url.format(linksUrl)
  };

  if (pager.next) {
    linksUrl.query.page = pager.next;
    linksUrl.search = undefined;
    links.nextPage = url.format(linksUrl);
  }

  if (pager.previous) {
    linksUrl.query.page = pager.previous;
    linksUrl.search = undefined;
    links.prevPage = url.format(linksUrl);
  }

  res.body = JSON.stringify(extend(
    {
      links: links,
      pager: pager,
      columns: {
        type: 'Type',
        name: 'Name',
        title: 'Title',
        phone: 'Phone',
        ext: 'Ext.',
        fax: 'Fax',
        email: 'Email'
      }
    },
    {contacts: items}
  ));
}

function createAction(req, res) {
  // let source = sanitizePayload(req.body);
  let source = JSON.parse(req.body);
  let errors = [];

  if (source) {
    let contacts = extend([], this.store.get('contacts') || []);
    let id = 0;

    contacts.map(contact => id = Math.max(id, contact.id));
    source.id = id + 1;

    contacts.push(source);
    this.store.set('contacts', contacts);

    res.statusCode = 201;
    res.setHeader('Location', req.url.href + '/' + source.id);
  } else {
    errors.push('Request is malformed.');
    res.statusCode = 400;
  }

  if (errors.length > 0) {
    // res.body = formatErrors(errors);
  }
}

function deleteAction(req, res) {
  let source = JSON.parse(req.body);
  let contacts = extend([], this.store.get('contacts') || []);
  let deleteIndexes = [];

  source.map(id => {
    contacts.some((contact, i) => {
      if (contact.id == id) {
        deleteIndexes.push(i);
        return true;
      }
    });
  });

  deleteIndexes.sort().reverse().map(i => contacts.splice(i, 1));

  this.store.set('contacts', contacts);
}

function sortItemsBy(key, order) {
  order = order === 'asc' ? 1 : -1;

  return (a, b) => {
    if (a[key] < b[key]) return -1 * order;
    else if (a[key] > b[key]) return 1 * order;
    else return 0;
  };
}
