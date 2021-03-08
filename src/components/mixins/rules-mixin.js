export default {
  data() {
    return {
      rules: {
        requiredRule: (value) => {
          return value === 1 || "Required";
        },
        stringRule: (value) => {
          const pattern = typeof value === "string" && value.length >= 1;
          return pattern || "Should be a string";
        },
        userRule: (value) => {
          const pattern = typeof value === "string" && value.length >= 4;
          return pattern || "Should be a minimum 4 characters string";
        },
        passwordRule: (value) => {
          const pattern = typeof value === "string" && value.length >= 6;
          return pattern || "Should be a minimum 6 characters string";
        },
        emailRule: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail";
        },
        websiteRule: (value) => {
          const pattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/;
          return pattern.test(value) || "Invalid website";
        },
        phoneRule: (value) => {
          const pattern = /^[0-9]{10}$/;
          return pattern.test(value) || "Should be a 10 digits number";
        },
        dateRule: (value) => {
          const pattern = /(19|20)\d{2}-(0|1)\d-([0-3])\d/;
          return pattern.test(value) || "Date required";
        },
        statusRule: (value) => {
          return value === "Complete" || value === "Pending" || "Required";
        },
      },
    };
  },
};
