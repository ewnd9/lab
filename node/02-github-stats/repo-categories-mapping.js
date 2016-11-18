const categories = {
  META: 'META',
  WEB_APP: 'WEB_APP',

  ATOM: 'ATOM',

  CLI: 'CLI',
  CLI_LIB: 'CLI_LIB',
  CLI_TOOL: 'CLI_TOOL',

  CHROME_EXTENSION: 'CHROME_EXTENSION',

  ELECTRON_APP: 'ELECTRON_APP',
  ELECTRON_LIB: 'ELECTRON_LIB',

  LIB: 'LIB',

  API_ACCESS_LIB: 'API_ACCESS_LIB',
  API_ACCESS_LIB_TOOLS: 'API_ACCESS_LIB_TOOLS',

  TEMP: 'TEMP',

  UNRECOGNIZED: 'UNRECOGNIZED'
};

const projects = {};

projects['media-center'] = categories.WEB_APP;
projects['anki-apkg-export-app'] = categories.WEB_APP;
projects['tracklister-app'] = categories.WEB_APP;
projects['the-feed'] = categories.WEB_APP;

projects['badtaste'] = categories.CLI;
projects['brightness-interactive-cli'] = categories.CLI;
projects['anki-apkg-export-cli'] = categories.CLI;
projects['cached-npm-install'] = categories.CLI;
projects['cached-npm-repo'] = categories.CLI;
projects['dictionary-cli'] = categories.CLI;
projects['knowledge-extractor-cli'] = categories.CLI;
projects['pw3'] = categories.CLI;
projects['telegram-bot-cli'] = categories.CLI;
projects['trakt-cli'] = categories.CLI;
projects['vk-google-music-export-cli'] = categories.CLI;
projects['watchtower-cli'] = categories.CLI;
projects['xavier-browsers'] = categories.CLI;
projects['workout-cli'] = categories.CLI;
projects['rutor-notify'] = categories.CLI;
projects['webpackman'] = categories.CLI;


projects['curl-to-node'] = categories.CLI_LIB;
projects['inquirer-bluebird'] = categories.CLI_LIB;
projects['inquirer-credentials'] = categories.CLI_LIB;
projects['inquirer-menu'] = categories.CLI_LIB;
projects['inquirer-question'] = categories.CLI_LIB;
projects['dot-file-config'] = categories.CLI_LIB;
projects['dropbox-symlink'] = categories.CLI_LIB;
projects['vk-auth-prompt'] = categories.CLI_LIB;
projects['progress-control'] = categories.CLI_LIB;

projects['inquirer-test'] = categories.CLI_TOOL;

//

projects['vk-universal-api'] = categories.API_ACCESS_LIB;
projects['opensubtitles-universal-api'] = categories.API_ACCESS_LIB;
projects['universal-api'] = categories.API_ACCESS_LIB;
projects['universal-api-test'] = categories.API_ACCESS_LIB_TOOLS;
projects['trakt-utils'] = categories.API_ACCESS_LIB_TOOLS;

//

projects['record-desktop'] = categories.ELECTRON_APP;
projects['xavier'] = categories.ELECTRON_APP;
projects['electron-image-menu'] = categories.ELECTRON_LIB;
projects['electron-save-file'] = categories.ELECTRON_LIB;

//

projects['html-preview'] = categories.LIB;
projects['ionic-press-again-to-exit'] = categories.LIB;
projects['split-torrent-release'] = categories.LIB;
projects['split-tracklist'] = categories.LIB;
projects['show-episode-format'] = categories.LIB;
projects['hain-plugin-chrome-bookmarks'] = categories.LIB;

//

projects['hyperclick-markdown'] = categories.ATOM;

//

projects['lab'] = categories.META;
projects['generator-ewnd9-npm'] = categories.META;
projects['generator-ewnd9-eslint'] = categories.META;

projects['electron-remote-require-investigation'] = categories.TEMP;
projects['hain-travis-publish-playground'] = categories.TEMP;

//

projects['trello-copy-title-extension'] = categories.CHROME_EXTENSION;
projects['procrastin8'] = categories.CHROME_EXTENSION;


exports.projects = projects;
exports.categories = categories;
