import setupComments from './ng-admin/comments';
import setupPosts from './ng-admin/posts';
import setupTags from './ng-admin/tags';

export default (NgAdminConfigurationProvider) => {
  var nga = NgAdminConfigurationProvider;

  function truncate(value) {
    if (!value) {
      return '';
    }

    return value.length > 50 ? value.substr(0, 50) + '...' : value;
  }

  var admin = nga.application('ng-admin backend demo') // application main title
    .debug(false) // debug disabled
    .baseApiUrl('http://localhost:3000/'); // main API endpoint

  var post = nga.entity('posts'); // the API endpoint for posts will be http://localhost:3000/posts/:id
  var comment = nga.entity('comments')
    .identifier(nga.field('id')); // you can optionally customize the identifier used in the api ('id' by default)
  var tag = nga.entity('tags')
    .readOnly(); // a readOnly entity has disabled creation, edition, and deletion views

  var subCategories = [
    { category: 'tech', label: 'Computers', value: 'computers' },
    { category: 'tech', label: 'Gadgets', value: 'gadgets' },
    { category: 'lifestyle', label: 'Travel', value: 'travel' },
    { category: 'lifestyle', label: 'Fitness', value: 'fitness' }
  ];

  admin
    .addEntity(post)
    .addEntity(tag)
    .addEntity(comment);

  setupPosts(nga, post, tag, subCategories);
  setupComments(nga, post, comment);
  setupTags(nga, tag);

  var customHeaderTemplate = require('!!raw!./ng-admin/templates/header.html');
  admin.header(customHeaderTemplate);

  admin.menu(
    nga.menu()
      .addChild(nga.menu(post).icon('<span class="glyphicon glyphicon-file"></span>')) // customize the entity menu icon
      .addChild(nga.menu(comment).icon('<strong style="font-size:1.3em;line-height:1em">✉</strong>')) // you can even use utf-8 symbols!
      .addChild(nga.menu(tag).icon('<span class="glyphicon glyphicon-tags"></span>'))
      .addChild(nga.menu().title('Other')
        .addChild(nga.menu().title('Stats').icon('').link('/stats'))
      )
  );

  var customDashboardTemplate = require('!!raw!./ng-admin/templates/dashboard.html');

  admin
    .dashboard(nga.dashboard()
    .addCollection(
      nga
        .collection(post)
        .name('recent_posts')
        .title('Recent posts')
        .perPage(5) // limit the panel to the 5 latest posts
        .fields([
         nga.field('published_at', 'date').label('Published').format('MMM d'),
         nga.field('title').isDetailLink(true).map(truncate),
         nga.field('views', 'number')
        ])
        .sortField('published_at')
        .sortDir('DESC')
        .order(1)
    )
    .addCollection(
      nga
        .collection(post)
        .name('popular_posts')
        .title('Popular posts')
        .perPage(5) // limit the panel to the 5 latest posts
        .fields([
          nga.field('published_at', 'date').label('Published').format('MMM d'),
          nga.field('title').isDetailLink(true).map(truncate),
          nga.field('views', 'number')
        ])
        .sortField('views')
        .sortDir('DESC')
        .order(3)
    )
    .addCollection(
      nga
        .collection(comment)
        .title('Last comments')
        .perPage(10)
        .fields([
          nga.field('created_at', 'date').label('Posted'),
          nga.field('body', 'wysiwyg').label('Comment').stripTags(true).map(truncate).isDetailLink(true),
          nga.field('post_id', 'reference').label('Post').targetEntity(post).targetField(nga.field('title').map(truncate))
        ])
        .sortField('created_at')
        .sortDir('DESC')
        .order(2)
    )
    .addCollection(
      nga
        .collection(tag)
        .title('Tags publication status')
        .perPage(10)
        .fields([
          nga.field('name'),
          nga.field('published', 'boolean').label('Is published ?')
        ])
        .listActions(['show'])
        .order(4)
    )
    .template(customDashboardTemplate)
  );

  nga.configure(admin);
};
