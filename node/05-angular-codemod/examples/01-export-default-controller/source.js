function test(test) {
  // shouldn't be annotated
};

export default {
  controller: (arg) => {
    // should be annotated
  }
};
