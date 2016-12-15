import React from 'react';
import styles from './style.css';

import { provideHooks } from 'redial';
import { connect } from 'react-redux';

import { fetchCategories } from '../../actions/categories-actions';
import { Link } from 'react-router';

function mapStateToProps(state) {
  const { categories } = state;

  return {
    categories
  };
};

const hooks = {
  fetch: ({ dispatch }) => dispatch(fetchCategories())
};

const Main = React.createClass({
  render() {
    const { categories: { categories } } = this.props;

    return (
      <div className={styles.categories}>
        {
          categories.map((category, index) => (
            <div key={index}>
              <Link to={`/category/${category.id}`} className={styles.link}>
                #{category.id}: {category.title}
              </Link>
            </div>
          ))
        }
      </div>
    );
  }
});

export default provideHooks(hooks)(connect(mapStateToProps)(Main));
