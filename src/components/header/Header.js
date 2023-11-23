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
                <ul className="menu-list">
                    <li><a href="/" className="menu-item">Home</a></li>
                    <li><a href="/topology" className="menu-item">Live model</a></li>
                    <li><a href="/analysis" className="menu-item">Analysis</a></li>
                    <li><a href="/notification" className="menu-item">Notifications & Events</a></li>
                </ul>
            </div>
        </nav>
        <img src={imageSrc} className="menu-icon" onClick={toggleMenu} />
    </div>
  )
}

export default Header