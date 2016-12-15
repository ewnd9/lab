function test() {
  // shouldn't be annotated
};

export const someConfig = $provider => console.log($provider);
export default $provider => console.log('should be annotated');
