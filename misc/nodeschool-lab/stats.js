const proxyquire = require('proxyquire');
const fs = require('fs');

const shop = process.argv[2];

function getStats(shop) {
  const lessons = [];

  proxyquire(`./${shop}/node_modules/.bin/${shop}`, {
    adventure: function() {
      return {
        add() {
          lessons.push(arguments[0]);
        },
        execute() {
        }
      }
    }
  });

  const completed = JSON.parse(fs.readFileSync(`./${shop}/completed.json`, 'utf-8'));
  const isCompleted = lesson => completed.indexOf(lesson) > -1;

  return {
    shop,
    completedCount: lessons.filter(isCompleted).length,
    count: lessons.length,
    lessons: lessons.map(lesson => ({
      name: lesson,
      isCompleted: isCompleted(lesson)
    }))
  };
};

function print(stats) {
  console.log(`## ${stats.shop} ${stats.completedCount} / ${stats.count}\n`);

  stats.lessons.forEach(lesson => {
    console.log(`- ${lesson.isCompleted ? '[x]' : '[ ]'} ${lesson.name}`);
  });
};

print(getStats(shop))

module.exports.getStats = getStats;
module.exports.print = print;
