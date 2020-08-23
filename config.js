module.exports = {
    PORT: process.env.PORT || 80 /* The port where the server is gonna run. */,
    system_user_pass: "toor" /* The password for the system user. The purpose of this is to prevent users emit message event with system property to true. */ // DEPRECATED
}