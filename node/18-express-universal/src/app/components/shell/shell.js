import React from 'react';
import styles from './style.css';

export default React.createClass({
  render() {
    return (
      <div className={styles.container}>
        { this.props.children }
      </div>
    );
  }
});
