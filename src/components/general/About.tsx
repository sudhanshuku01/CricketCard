import Layout from "../../layout/Layout";
import { IoLogoLinkedin } from "react-icons/io";
import { IoMdMailOpen } from "react-icons/io";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Layout>
      <div className="about">
        <h1>About Cricket Card Game</h1>

        <h2>Introduction</h2>
        <p>
          The Cricket Card Game is a unique blend of fun and learning. Dive into
          the world of cricket through an engaging card game that tests your
          cricket knowledge and strategic skills.
        </p>

        <h2>Game Concept</h2>
        <p>
          Our game brings together the excitement of cricket and the thrill of
          card games. By leveraging real-time player data, we offer an immersive
          experience for cricket enthusiasts.
        </p>

        <h2>Features</h2>
        <ul>
          <li>Real-time player data updates</li>
          <li>Multiplayer mode</li>
          <li>Various betting attributes</li>
          <li>User-friendly interface</li>
          <li>Educational and entertaining</li>
        </ul>

        <h2>How It Works</h2>
        <p>
          Register with your name, find online users to challenge, and start
          betting on different cricket attributes. Enhance your cricket
          knowledge while having fun with friends.
        </p>

        <h2>About the Developers</h2>
        <p>
          Our team is passionate about cricket and technology. We aim to create
          games that not only entertain but also educate and bring the cricket
          community together.
        </p>

        <h2>Mission and Vision</h2>
        <p>
          Our mission is to promote cricket knowledge through engaging gameplay.
          We envision a future where cricket fans worldwide can connect and
          compete in our game, with continuous updates and new features.
        </p>

        <h2>Community and Support</h2>
        <p>
          Join our community on social media, share your experiences, and
          connect with other players. For support, feedback, or suggestions,
          feel free to contact us.
        </p>

        <h2>Acknowledgments</h2>
        <p>
          We thank all our contributors, testers, and supporters who helped make
          this game a reality. Special thanks to our data providers and the
          cricket community for their ongoing support.
        </p>

        <h2>Contact Us</h2>
        <p>
          For any inquiries, please reach out to us at
          sudhanshu.kumar.mail@gmail.com
        </p>
        <div className="link">
          <Link
            to="mailto:sudhanshu.kumar.mail@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoMdMailOpen />
          </Link>
          <Link
            to="https://in.linkedin.com/in/sudhanshu-kumar-2a9ba5228"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLogoLinkedin />
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default About;
