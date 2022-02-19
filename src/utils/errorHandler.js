export default {
  generalErrorHandler: (err) => {
    return (self) => {
      if (err instanceof Error) {
        self.$store.dispatch("ADD_NOTIFICATION", {
          type: "error",
          message: `${err.name}: ${err.message}`,
        });
      } else {
        self.$store.dispatch("ADD_NOTIFICATION", {
          type: "error",
          message: `${err}`,
        });
      }
    };
  },
};