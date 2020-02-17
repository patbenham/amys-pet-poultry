function galleryStore() {
  const store = {};
  return {
    get(id) {
      if (id in store) return store[id];
      else return null;
    },
    store(id, gallery) {
      return (store[id] = gallery);
    }
  };
}

export { galleryStore as default };
