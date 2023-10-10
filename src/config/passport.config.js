import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import bcrypt from "bcrypt";
import { userModel } from "../dao/models/user.model.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, age } = req.body;
        try {
          const exists = await userModel.findOne({ email: username });
          if (exists) {
            return done(null, false);
          }

          const user = await userModel.create({
            first_name,
            last_name,
            age,
            email: username,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
          });
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          if (!user) {
            return done(null, false);
          }

          if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false);
          }

          if (user.email === "adminCoder@coder.com") {
            user.rol = "admin";
          } else {
            user.rol = "usuario";
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.use(
    new GitHubStrategy(
      {
        clientID: "Iv1.cd3ec41d4d47eab3",
        clientSecret: "895aa366a38c5a039486636dc046191765efccda",
        callbackURL: "http://localhost:3001/api/githubcallback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
          const email = profile.emails[0].value;
          const user = await userModel.findOne({ email });

          if (!user) {
            const newUser = await userModel.create({
              first_name: profile.username,
              last_name: "",
              age: 27,
              password: "",
              email,
            });

            return done(null, newUser);
          } else {
            done(null, user);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
    console.log(user);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id).lean();
    done(null, user);
  });
};

export default initializePassport;
