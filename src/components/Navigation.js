import React from "react";
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

const Navigation = ({userObj}) => <nav>
    <ul className="navigation">
        <li>
            <Link to="/">
                <FontAwesomeIcon
                    icon={faTwitter}
                    color={"#04AAFF"}
                    size="3x"
                    style={{ marginBottom: 30 }}
                />
            </Link>
        </li>
        <li><Link to="/profile">{userObj && userObj.displayName}의 Profile</Link></li>
    </ul>
</nav>

export default Navigation;