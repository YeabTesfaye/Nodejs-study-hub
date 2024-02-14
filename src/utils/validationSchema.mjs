export const createUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage:
        "Username must be at least 5 characters with max of 32 characters",
    },
    notEmpty: {
      errorMessage: "Username cannot be empty",
    },
    isString: {
      errorMessage: "Username must be string",
    },
  },
  displayName: {
    notEmpty: true,
  },
  password: {
    notEmpty: true,
  },
};

export const createUserQueryValidationSchema = {
  filter: {
    isString: {
      errorMessage: "filter must be string",
    },
    notEmpty: {
      errorMessage: "filter cannot be empty",
    },
    isLength: {
      options: {
        min: 3,
        max: 10,
      },
      errorMessage: "filter value must be between 3-10 characters",
    },
  },
  value: {
    isString: {
      errorMessage: "value must be string",
    },
    notEmpty: {
      errorMessage: "value cannot be empty",
    },
    isLength: {
      options: {
        min: 3,
        max: 10,
      },
      errorMessage: "value value must be between 3-10 characters",
    },
  },
};
