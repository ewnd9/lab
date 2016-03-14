function truncate(value) {
  if (!value) {
    return '';
  }

  return value.length > 50 ? value.substr(0, 50) + '...' : value;
}

export default (nga, post, comment) => {
  comment.listView()
      .title('Comments')
      .perPage(10) // limit the number of elements displayed per page. Default is 30.
      .fields([
          nga.field('created_at', 'date')
              .label('Posted'),
          nga.field('author.name')
              .label('Author')
              .cssClasses('hidden-xs'),
          nga.field('body', 'wysiwyg')
              .stripTags(true)
              .map(truncate),
          nga.field('post_id', 'reference')
              .label('Post')
              .targetEntity(post)
              .targetField(nga.field('title').map(truncate))
              .cssClasses('hidden-xs')
              .singleApiCall(ids => { return {'id': ids }; })
      ])
      .filters([
          nga.field('q')
              .label('')
              .pinned(true)
              .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>')
              .transform(v => v && v.toUpperCase()) // transform the entered value before sending it as a query parameter
              .map(v => v && v.toLowerCase()), // map the query parameter to a displayed value in the filter form
          nga.field('created_at', 'date')
              .label('Posted')
              .attributes({'placeholder': 'Filter by date'}),
          nga.field('post_id', 'reference')
              .label('Post')
              .targetEntity(post)
              .targetField(nga.field('title'))
              .remoteComplete(true, {
                  refreshDelay: 200,
                  searchQuery: function(search) { return { q: search }; }
              })
      ])
      .listActions(['edit', 'delete']);

  comment.creationView()
      .fields([
          nga.field('created_at', 'date')
              .label('Posted')
              .defaultValue(new Date()), // preset fields in creation view with defaultValue
          nga.field('author.name')
              .label('Author'),
          nga.field('body', 'wysiwyg'),
          nga.field('post_id', 'reference')
              .label('Post')
              .targetEntity(post)
              .targetField(nga.field('title').map(truncate))
              .sortField('title')
              .sortDir('ASC')
              .validation({ required: true })
              .remoteComplete(true, {
                  refreshDelay: 200,
                  searchQuery: function(search) { return { q: search }; }
              })
      ]);

  comment.editionView()
      .fields(comment.creationView().fields())
      .fields([
          nga.field('').label('')
              .template('<post-link entry="entry"></post-link>') // template() can take a function or a string
      ]);

  comment.deletionView()
      .title('Deletion confirmation'); // customize the deletion confirmation message
};
