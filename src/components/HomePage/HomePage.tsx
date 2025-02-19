import { Container, Typography, Grid, Box } from "@mui/material";
import { GitHub as GitHubIcon } from "@mui/icons-material";
import CustomButton from "../Button/Button";
import back from "../image_assets/back-v.png";
import theme from "../../theme";
import { Google } from "@mui/icons-material";
import { database, storage, signInWithGooglePopup } from "../../firebaseConf";
import { ref, get, child, set } from "firebase/database";
import { Zoom, toast } from "react-toastify";
import "../testimonial/testimonial.css";
import { motion } from "framer-motion";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import bannerImage from "../image_assets/bannerImage.png";
import bannerImage2 from "../image_assets/bannerImage2.png";
import bannerImage3 from "../image_assets/bannerImage3.png";
import { Link } from "react-router-dom";
import TestimonialsCarousel from "../testimonial/TestimonialsCarousel";

const HomePage = () => {
  const loggedIn = localStorage.getItem("userUid");

  const logGoogleUser = async () => {
    try {
      const response = await signInWithGooglePopup();
      const { email, uid, displayName: username, photoURL } = response.user;

      const usersRef = ref(database, "users-ss");
      const userRef = child(usersRef, uid);

      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        localStorage.setItem("userUid", uid);
        localStorage.setItem("username", `${username}`);
        localStorage.setItem("userPic", userData.profile || userData.pic || "");
        window.location.reload();
        toast.success("Logged in successfully", { transition: Zoom });
      } else {
        const randomColors = [
          "#FFEBEE",
          "#E3F2FD",
          "#E8F5E9",
          "#FFFDE7",
          "#F3E5F5",
          "#FFF3E0",
          "#E0F7FA",
          "#FFF0E1",
          "#F8F4FF",
          "#E0F2F1",
        ];
        const randomColor =
          randomColors[Math.floor(Math.random() * randomColors.length)];
        const picURL = photoURL || "";

        if (picURL) {
          try {
            const response = await fetch(picURL);
            if (!response.ok) throw new Error("Failed to fetch the image");

            const imageBlob = await response.blob();

            const profileImageRef = storageRef(
              storage,
              `user-profile-pics/user-profile-pic-${uid}`
            );
            await uploadBytes(profileImageRef, imageBlob);
            const picURL_firebase = await getDownloadURL(profileImageRef);

            await set(userRef, {
              name: username,
              email,
              pic: picURL_firebase,
              tags: "",
              banner: randomColor,
              uid,
            });

            localStorage.setItem("userUid", uid);
            localStorage.setItem("userPic", picURL);
            window.location.reload();
            toast.success("Signed up successfully", { transition: Zoom });
          } catch (error) {
            console.error("Error uploading image to Firebase Storage:", error);
          }
        }
      }
    } catch (error) {
      console.error(error);

      if (error instanceof Error && error.message.includes("popup")) {
        // Handle pop-up closed by user
        // toast.error("Sign up process was canceled", { transition: Zoom });
      } else {
        // Handle other authentication errors
        toast.error("Failed to sign up. Please try again.", {
          transition: Zoom,
        });
      }
    }
  };

  return (
    <div
      style={{
        paddingTop: "6.5em",
        height: "100%",
        overflow: "hidden",
        background:
          "radial-gradient(circle, rgb(1 126 172 / 83%) 0%, rgb(27, 79, 105) 40%, rgb(0, 0, 0) 80%)",
        // "radial-gradient(circle,navy 0%, seagreen 50%, rgba(0, 0, 0, 1) 90%)",
      }}
    >
      <Container maxWidth="xl" style={{ height: "100%", width: "100%" }}>
        <Grid
          container
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Content column */}
          <Grid
            item
            xs={12}
            lg={6}
            style={{
              color: "#ffffff",
              paddingTop: "10rem",
            }}
          >
            <Grid container direction="column" spacing={2}>
              <Grid item container>
                <motion.div
                  initial={{ opacity: 0, y: -150 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1,
                    type: "spring",
                    stiffness: 100,
                    delay: 0.5,
                  }}
                >
                  <Typography variant="h3" fontWeight="bold">
                    Discover, Learn, Grow:{" "}
                    <span style={{ fontWeight: "normal" }}>
                      Find Live Skill-Sharing Events!
                    </span>
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -150 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1,
                    type: "spring",
                    stiffness: 100,
                    delay: 1,
                  }}
                >
                  <Typography
                    fontSize={"1.4rem"}
                    style={{ marginTop: "2rem", marginBottom: "4rem" }}
                  >
                    A dynamic open-source platform revolutionizing how we learn
                    and share skills! Whether you're an expert or an enthusiast,
                    everyone has something valuable to teach. Join events, share
                    resources, and connect with others to explore and expand
                    your knowledge. Dive in and experience the future of skill
                    sharing today!
                  </Typography>
                </motion.div>
              </Grid>
              <Grid item container spacing={2}>
                <Grid item xs={12} style={{ marginTop: "3rem" }}>
                  <motion.div
                    initial={{ opacity: 0, y: -150 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1,
                      type: "spring",
                      stiffness: 100,
                      delay: 1.5,
                    }}
                  >
                    {!loggedIn && (
                      <Typography
                        variant="h5"
                        fontWeight={600}
                        style={{ marginBottom: "1rem", marginLeft: ".3rem" }}
                      >
                        Ready to share skills ? 🧠
                      </Typography>
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -150 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1,
                      type: "spring",
                      stiffness: 100,
                      delay: 1.5,
                    }}
                  >
                    {!loggedIn && (
                      <CustomButton
                        icon={<Google />}
                        text="Continue with Google"
                        backgroundColor="#FFC0D9"
                        textColor={theme.colors.darkBackground}
                        onClick={() => logGoogleUser()}
                        colorChange={true}
                        borderColor="#FF90BC"
                      />
                    )}
                  </motion.div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/* Background image column */}
          <Grid
            item
            xs={12}
            lg={6}
            style={{
              marginTop: "2.2rem",
              backgroundImage: `url(${back})`,
              backgroundSize: "auto 95vh",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right",
              height: "100vh",
            }}
          />

          <Grid
            item
            xs={12}
            style={{ padding: "2rem", marginTop: "4rem", marginBottom: "4rem" }}
          >
            <Grid container alignItems="center">
              <Grid item xs={12} sm={6} textAlign={"center"}>
                <motion.div
                  initial={{ opacity: 0, x: -150 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1,
                    type: "spring",
                    stiffness: 100,
                    delay: 0.5,
                  }}
                >
                  <Typography
                    fontWeight={"bold"}
                    variant="h3"
                    style={{ color: "#ffffff" }}
                  >
                    Explore Learning Opportunities
                  </Typography>
                </motion.div>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 2,
                    type: "spring",
                    stiffness: 50,
                    delay: 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: ".5rem",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="30"
                      height="30"
                      style={{
                        color: theme.colors.primary,
                        marginRight: "1rem",
                      }}
                    >
                      <motion.path
                        d="M7 10 L12 15 L22 5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{ duration: 0.2, delay: 0.5 }}
                      />
                    </svg>
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1,
                        stiffness: 100,
                        delay: 0.5,
                      }}
                      style={{
                        color: "#ffffff",
                        fontSize: theme.fontSize.textBody,
                      }}
                    >
                      Join Online Events: Learn from Industry Experts and Expand
                      Your Skillset.
                    </motion.span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: ".5rem",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="30"
                      height="30"
                      style={{
                        color: theme.colors.primary,
                        marginRight: "1rem",
                      }}
                    >
                      <motion.path
                        d="M7 10 L12 15 L22 5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{ duration: 0.2, delay: 1.5 }}
                      />
                    </svg>
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1,
                        stiffness: 100,
                        delay: 1.5,
                      }}
                      style={{
                        color: "#ffffff",
                        fontSize: theme.fontSize.textBody,
                      }}
                    >
                      Share Resources: Contribute to the Learning Community by
                      Sharing Your Knowledge.
                    </motion.span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: ".5rem",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="30"
                      height="30"
                      style={{
                        color: theme.colors.primary,
                        marginRight: "1rem",
                      }}
                    >
                      <motion.path
                        d="M7 10 L12 15 L22 5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{ duration: 0.2, delay: 2.5 }}
                      />
                    </svg>
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1,
                        stiffness: 100,
                        delay: 2.5,
                      }}
                      style={{
                        color: "#ffffff",
                        fontSize: theme.fontSize.textBody,
                      }}
                    >
                      Host Online Events: Share Your Expertise and Connect with
                      Learners Worldwide.
                    </motion.span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: ".5rem",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="30"
                      height="30"
                      style={{
                        color: theme.colors.primary,
                        marginRight: "1rem",
                      }}
                    >
                      <motion.path
                        d="M7 10 L12 15 L22 5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{ duration: 0.2, delay: 3.5 }}
                      />
                    </svg>
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1,
                        stiffness: 100,
                        delay: 3.5,
                      }}
                      style={{
                        color: "#ffffff",
                        fontSize: theme.fontSize.textBody,
                      }}
                    >
                      Read Articles: Access Valuable Resources and Stay Updated
                      on Latest Trends.
                    </motion.span>
                  </div>
                </motion.div>
              </Grid>
            </Grid>
            {/* testimonial */}
            <Container maxWidth="xl">
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                marginTop="180px"
              >
                <Grid item xs={12} textAlign={"center"}>
                  <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1,
                      type: "spring",
                      stiffness: 100,
                      delay: 0.5,
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight="Bold"
                      style={{
                        marginBottom: "1rem",
                        marginLeft: ".3rem",
                        color: "#ffffff",
                      }}
                    >
                      Happy Users
                    </Typography>
                  </motion.div>
                </Grid>
                <Grid item xs={12}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1,
                      type: "spring",
                      stiffness: 100,
                      delay: 1,
                    }}
                  >
                    <Box mt={4} mb={8}>
                      <TestimonialsCarousel />
                    </Box>
                  </motion.div>
                </Grid>
              </Grid>
            </Container>
           
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default HomePage;
