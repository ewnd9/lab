export default (nga, post, tag, subCategories) => {
  var x = post.listView()
      .title('All posts') // default title is "[Entity_name] list"
      .description('List of posts with infinite pagination') // description appears under the title
      .infinitePagination(true) // load pages as the user scrolls
      .fields([
          nga.field('id').label('id'), // The default displayed name is the camelCase field name. label() overrides id
          nga.field('title'), // the default list field type is "string", and displays as a string
          nga.field('published_at', 'date'),  // Date field type allows date formatting
          nga.field('average_note', 'float') // Float type also displays decimal digits
              .cssClasses('hidden-xs'),
          nga.field('views', 'number')
              .cssClasses('hidden-xs'),
          nga.field('backlinks', 'embedded_list') // display list of related comments
              .label('Links')
              .map(links => links ? links.length : '')
              .template('{{ value }}'),
          nga.field('tags', 'reference_many') // a Reference is a particular type of field that references another entity
              .targetEntity(tag) // the tag entity is defined later in this file
              .targetField(nga.field('name')) // the field to be displayed in this list
              .cssClasses('hidden-xs')
              .singleApiCall(ids => { return {'id': ids }; })
      ])
      .filters([
          nga.field('category', 'choice').choices([
              { label: 'Tech', value: 'tech' },
              { label: 'Lifestyle', value: 'lifestyle' }
          ]).label('Category'),
          nga.field('subcategory', 'choice').choices(subCategories).label('Subcategory')
      ])
      .listActions(['show', 'edit', 'delete'])
      .exportFields([
          post.listView().fields(), // fields() without arguments returns the list of fields. That way you can reuse fields from another view to avoid repetition
          nga.field('category', 'choice') // a choice field is rendered as a dropdown in the edition view
              .choices([ // List the choice as object literals
                  { label: 'Tech', value: 'tech' },
                  { label: 'Lifestyle', value: 'lifestyle' }
              ]),
          nga.field('subcategory', 'choice')
              .choices(function(entry) { // choices also accepts a function to return a list of choices based on the current entry
                  return subCategories.filter(function (c) {
                      return c.category === entry.values.category;
                  });
              }),
      ]);

  post.creationView()
      .fields([
          nga.field('title') // the default edit field type is "string", and displays as a text input
              .attributes({ placeholder: 'the post title' }) // you can add custom attributes, too
              .validation({ required: true, minlength: 3, maxlength: 100 }), // add validation rules for fields
          nga.field('teaser', 'text'), // text field type translates to a textarea
          nga.field('body', 'wysiwyg'), // overriding the type allows rich text editing for the body
          nga.field('published_at', 'date') // Date field type translates to a datepicker
      ]);

  post.editionView()
      .title('Edit post "{{ entry.values.title }}"') // title() accepts a template string, which has access to the entry
      .actions(['list', 'show', 'delete']) // choose which buttons appear in the top action bar. Show is disabled by default
      .fields([
          post.creationView().fields(), // fields() without arguments returns the list of fields. That way you can reuse fields from another view to avoid repetition
          nga.field('category', 'choice') // a choice field is rendered as a dropdown in the edition view
              .choices([ // List the choice as object literals
                  { label: 'Tech', value: 'tech' },
                  { label: 'Lifestyle', value: 'lifestyle' }
              ]),
          nga.field('subcategory', 'choice')
              .choices(function(entry) { // choices also accepts a function to return a list of choices based on the current entry
                  return subCategories.filter(function (c) {
                      return c.category === entry.values.category;
                  });
              })
              .template('<ma-field ng-if="entry.values.category" field="::field" value="entry.values[field.name()]" entry="entry" entity="::entity" form="formController.form" datastore="::formController.dataStore"></ma-field>', true),
          nga.field('tags', 'reference_many') // ReferenceMany translates to a select multiple
              .targetEntity(tag)
              .targetField(nga.field('name'))
              .attributes({ placeholder: 'Select some tags...' })
              .remoteComplete(true, {
                  refreshDelay: 300 ,
                  searchQuery: function(search) { return { q: search }; }
              })
              .singleApiCall(ids => { return {'id': ids }; })
              .cssClasses('col-sm-4'), // customize look and feel through CSS classes
          nga.field('pictures', 'json'),
          nga.field('views', 'number')
              .cssClasses('col-sm-4'),
          nga.field('average_note', 'float')
              .cssClasses('col-sm-4'),
          nga.field('backlinks', 'embedded_list') // display embedded list
              .targetFields([
                  nga.field('date', 'datetime'),
                  nga.field('url')
                      .cssClasses('col-lg-10')
              ])
              .sortField('date')
              .sortDir('DESC'),
          nga.field('comments', 'referenced_list') // display list of related comments
              .targetEntity(nga.entity('comments'))
              .targetReferenceField('post_id')
              .targetFields([
                  nga.field('id').isDetailLink(true),
                  nga.field('created_at').label('Posted'),
                  nga.field('body').label('Comment')
              ])
              .sortField('created_at')
              .sortDir('DESC')
              .listActions(['edit']),
          nga.field('').label('')
              .template('<span class="pull-right"><ma-filtered-list-button entity-name="comments" filter="{ post_id: entry.values.id }" size="sm"></ma-filtered-list-button><ma-create-button entity-name="comments" size="sm" label="Create related comment" default-values="{ post_id: entry.values.id }"></ma-create-button></span>')
      ]);

  post.showView() // a showView displays one entry in full page - allows to display more data than in a a list
      .fields([
          nga.field('id'),
          nga.field('category', 'choice') // a choice field is rendered as a dropdown in the edition view
              .choices([ // List the choice as object literals
                  { label: 'Tech', value: 'tech' },
                  { label: 'Lifestyle', value: 'lifestyle' }
              ]),
          nga.field('subcategory', 'choice')
              .choices(subCategories),
          nga.field('tags', 'reference_many') // ReferenceMany translates to a select multiple
              .targetEntity(tag)
              .targetField(nga.field('name')),
          nga.field('pictures', 'json'),
          nga.field('views', 'number'),
          nga.field('average_note', 'float'),
          nga.field('backlinks', 'embedded_list') // display embedded list
              .targetFields([
                  nga.field('date', 'datetime'),
                  nga.field('url')
              ])
              .sortField('date')
              .sortDir('DESC'),
          nga.field('comments', 'referenced_list') // display list of related comments
              .targetEntity(nga.entity('comments'))
              .targetReferenceField('post_id')
              .targetFields([
                  nga.field('id').isDetailLink(true),
                  nga.field('created_at').label('Posted'),
                  nga.field('body').label('Comment')
              ])
              .sortField('created_at')
              .sortDir('DESC')
              .listActions(['edit']),
          nga.field('').label('')
              .template('<span class="pull-right"><ma-filtered-list-button entity-name="comments" filter="{ post_id: entry.values.id }" size="sm"></ma-filtered-list-button><ma-create-button entity-name="comments" size="sm" label="Create related comment" default-values="{ post_id: entry.values.id }"></ma-create-button></span>'),
          nga.field('custom_action').label('')
              .template('<send-email post="entry"></send-email>')
      ]);
};
