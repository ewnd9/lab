'use strict';

const fs = require('fs');
const result = [];

const data = require('./repo-categories-mapping');
const categories = data.categories;
const projects = data.projects;

const metaData = require('./data/info.json');

fs.readdirSync('./data').forEach(file => {
  if (fs.lstatSync('./data/' + file).isDirectory()) {
    const repo = file;
    const category = projects[repo] || categories.UNRECOGNIZED;

    if (!result[category]) {
      result[category] = [];
    }

    const desc = (metaData.descriptions[repo] || '').toLowerCase();

    result[category].push({
      repo,
      deprecated: desc.indexOf('[deprecated]') === 0,
      wip: desc.indexOf('[wip]') === 0
    });
  }
});

Object
  .keys(categories)
  .forEach(category => {
    printCategory(category);
  });


function printCategory(category) {
  console.log(`${category}:`);
  const projects = result[category] || [];

  projects.sort((a, b) => (a.repo < b.repo) ? -1 : (a.repo > b.repo ? 1 : 0));

  projects.forEach(project => {
    console.log(`  ${project.repo} ${project.wip && '(wip)' || ''} ${project.deprecated && '(deprecated)' || ''}`);
  });
}
