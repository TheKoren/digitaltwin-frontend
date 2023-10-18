import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNetworkWired } from "@fortawesome/free-solid-svg-icons";
import './header.css'
import imageSrc from "../../assets/menu.png"
import { useState } from "react";

const Header = () => {

    const [menuVisible, setMenuVisible] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    }

    const handleLogoClick = () => {
        setIsClicked(!isClicked);
    }


  return (
    <div className="navbar">
        <div className={`logo ${isClicked ? 'clicked' : ''}`} onClick={handleLogoClick}>
            <FontAwesomeIcon icon={faNetworkWired} style={{ marginRight: '5px' }}/> DigitalTwin
        </div>        
        <nav>
            <div className={`menu-container ${menuVisible ? 'hidden' : ''}`}>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/topology">Topology</a></li>
                    <li><a href="/analysis">Analysis</a></li>
                    <li><a href="/events">Events</a></li>
                </ul>
            </div>
        </nav>
        <img src={imageSrc} className="menu-icon" onClick={toggleMenu} />
    </div>
  )
}

export default Header