module.exports = function getAllRoutes(routes) {
  return h(routes, '/', []);

  function h(root, parent, acc) {
    let currPath = parent;

    if (root.props && root.props.path) {
      currPath = (parent[parent.length - 1] === '/' ? parent.slice(0, parent.length - 1) : parent) + root.props.path;
      acc.push(currPath);
    }

    if (root.props && root.props.children) {
      if (Array.isArray(root.props.children)) {
        root.props.children.forEach(child => {
          h(child, currPath, acc);
        });
      } else {
        h(root.props.children, currPath, acc);
      }
    }

    return acc;
  }
}
