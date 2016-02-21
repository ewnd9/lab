export default (nga, tag) => {
  tag.listView()
      .infinitePagination(false) // by default, the list view uses infinite pagination. Set to false to use regulat pagination
      .fields([
          nga.field('id').label('ID'),
          nga.field('name'),
          nga.field('published', 'boolean').cssClasses(function(entry) { // add custom CSS classes to inputs and columns
              if (entry && entry.values){
                  if (entry.values.published) {
                      return 'bg-success text-center';
                  }
                  return 'bg-warning text-center';
              }
          }),
          nga.field('custom')
              .label('Upper name')
              .template('{{ entry.values.name.toUpperCase() }}')
              .cssClasses('hidden-xs'),
          nga.field('nb_posts')
      ])
      .filters([
          nga.field('published')
              .label('Not yet published')
              .template(' ')
              .defaultValue(false)
      ])
      .batchActions([]) // disable checkbox column and batch delete
      .listActions(['show', 'edit']);

  tag.editionView()
      .fields([
          nga.field('name'),
          nga.field('published', 'boolean').validation({
              required: true // as this boolean is required, ng-admin will use a checkbox instead of a dropdown
          })
      ]);

  tag.showView()
      .fields([
          nga.field('name'),
          nga.field('published', 'boolean')
      ]);
};
