const passport = require("passport");
const { Strategy } = require("passport-local");
const bcrypt = require("bcryptjs");
const customer = require("../branchs/cvServeBranch/schemas/customer.js");

// bcrypt.compareSync(raw, hash);

passport.serializeUser(async (user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const customer1 = await customer.findById(id);

        if (!customer1) throw new Error("User not found");
        done(null, customer1);
    } catch (err) {
        console.log("here..");
        done(err, null);
    }
});
passport.use(
    new Strategy(
        {
            usernameField: "email",
        },
        async (email, passowrd, done) => {
            try {
                if (!email || !passowrd) {
                    throw new Error("missing credidentials");
                }
                const customer1 = await customer.findOne({ email: email });

                if (!customer1) {
                    throw done(new Error("user not found"), null);
                } else {
                    const isValid = bcrypt.compareSync(passowrd, customer1.password);
                    if (isValid) {
                        done(null, customer1);
                    } else {
                        throw done(new Error("passowrd not correct"), null);
                    }
                }
            } catch (err) {
                done(err, null);
            }
        }
    )
);