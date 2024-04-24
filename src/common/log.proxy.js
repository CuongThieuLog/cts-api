const ExpresssLogProxy = (obj) => {
  const logHandle = {
    get: (target, propKey, args) => {
      const originMethod = target[propKey]; //get current method
      return async (...args) => {
        //currently, this log only work with express, so args always have 3 items
        let request = args[0];
        let response = args[1];
        let next = args[2];

        try {
          await originMethod.apply(obj, args); //call method with it property and args
        } catch (error) {
          next(error, request, response); //next to handle exceptions
        }
      };
    },
  };

  return new Proxy(obj, logHandle);
};

module.exports = ExpresssLogProxy;
